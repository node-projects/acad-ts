import { CadDocument } from '../../../CadDocument.js';
import { DwgFileHeaderAC15 } from '../FileHeaders/DwgFileHeaderAC15.js';
import { DwgSectionLocatorRecord } from '../FileHeaders/DwgSectionLocatorRecord.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { CRC8StreamHandler } from '../CRC8StreamHandler.js';
import { DwgStreamWriterBase } from './DwgStreamWriterBase.js';
import { IDwgStreamWriter } from './IDwgStreamWriter.js';
import { DwgFileHeaderWriterBase } from './DwgFileHeaderWriterBase.js';

export class DwgFileHeaderWriterAC15 extends DwgFileHeaderWriterBase<DwgFileHeaderAC15> {
	override get fileHeaderSize(): number { return 0x61; }

	override get handleSectionOffset(): number {
		return this.fileHeaderSize
			+ (this._records.get(DwgSectionDefinition.auxHeader)!.stream?.length ?? 0)
			+ (this._records.get(DwgSectionDefinition.preview)!.stream?.length ?? 0)
			+ (this._records.get(DwgSectionDefinition.header)!.stream?.length ?? 0)
			+ (this._records.get(DwgSectionDefinition.classes)!.stream?.length ?? 0);
	}

	private static readonly _nRecords = 6;

	private _endSentinel = new Uint8Array([
		0x95, 0xA0, 0x4E, 0x28, 0x99, 0x82, 0x1A, 0xE5, 0x5E, 0x41, 0xE0, 0x5F, 0x9D, 0x3A, 0x4D, 0x00
	]);

	private _records: Map<string, DwgSectionLocatorRecord> = new Map();

	constructor(stream: Uint8Array, encoding: string, document: CadDocument) {
		super(stream, encoding, document, new DwgFileHeaderAC15());

		this._records.set(DwgSectionDefinition.auxHeader, new DwgSectionLocatorRecord(5));
		this._records.set(DwgSectionDefinition.preview, new DwgSectionLocatorRecord(null));
		this._records.set(DwgSectionDefinition.header, new DwgSectionLocatorRecord(0));
		this._records.set(DwgSectionDefinition.classes, new DwgSectionLocatorRecord(1));
		this._records.set(DwgSectionDefinition.acDbObjects, new DwgSectionLocatorRecord(null));
		this._records.set(DwgSectionDefinition.handles, new DwgSectionLocatorRecord(2));
		this._records.set(DwgSectionDefinition.objFreeSpace, new DwgSectionLocatorRecord(3));
		this._records.set(DwgSectionDefinition.template, new DwgSectionLocatorRecord(4));
	}

	override addSection(name: string, stream: Uint8Array, isCompressed: boolean, decompsize: number = 29696): void {
		this._records.get(name)!.stream = stream;
	}

	override writeFile(): void {
		this._setSeekers();
		this._writeFileHeader();
		this._writeRecordStreams();
	}

	private _setSeekers(): void {
		let currOffset = this.fileHeaderSize;
		for (const [, record] of this._records) {
			record.seeker = currOffset;
			currOffset += (record.stream?.length ?? 0);
		}
	}

	private _writeFileHeader(): void {
		const ms: number[] = [];

		const msWriter = {
			pos: 0,
			writeByte(b: number) { ms.push(b & 0xFF); },
			writeBytes(arr: Uint8Array, offset: number = 0, length?: number) {
				const len = length ?? arr.length;
				for (let i = 0; i < len; i++) ms.push(arr[offset + i]);
			},
			writeRawLong(value: number) {
				ms.push(value & 0xFF);
				ms.push((value >>> 8) & 0xFF);
				ms.push((value >>> 16) & 0xFF);
				ms.push((value >>> 24) & 0xFF);
			},
			writeRawShort(value: number) {
				ms.push(value & 0xFF);
				ms.push((value >>> 8) & 0xFF);
			},
		};

		//0x00	6	"ACXXXX" version string
		const versionBytes = new TextEncoder().encode(this._document.header.versionString);
		msWriter.writeBytes(versionBytes, 0, 6);

		//The next 7 starting at offset 0x06
		msWriter.writeBytes(new Uint8Array([0, 0, 0, 0, 0, 15, 1]));

		//At 0x0D is the preview seeker
		msWriter.writeRawLong(this._records.get(DwgSectionDefinition.preview)!.seeker);

		msWriter.writeByte(0x1B);
		msWriter.writeByte(0x19);

		//Code page at 0x13
		msWriter.writeRawShort(this.getFileCodePage());
		msWriter.writeRawLong(DwgFileHeaderWriterAC15._nRecords);

		this._writeRecord(msWriter, this._records.get(DwgSectionDefinition.header)!);
		this._writeRecord(msWriter, this._records.get(DwgSectionDefinition.classes)!);
		this._writeRecord(msWriter, this._records.get(DwgSectionDefinition.handles)!);
		this._writeRecord(msWriter, this._records.get(DwgSectionDefinition.objFreeSpace)!);
		this._writeRecord(msWriter, this._records.get(DwgSectionDefinition.template)!);
		this._writeRecord(msWriter, this._records.get(DwgSectionDefinition.auxHeader)!);

		//Pad to align
		const bitPad = (8 - (ms.length * 8) % 8) % 8;
		if (bitPad > 0) {
			// writeSpearShift - pad to byte boundary (already at byte boundary in this array-based approach)
		}

		//CRC
		const msArr = new Uint8Array(ms);
		const crc = CRC8StreamHandler.getCRCValue(0xC0C1, msArr, 0, msArr.length);
		msWriter.writeRawShort(crc);

		//End sentinel
		msWriter.writeBytes(this._endSentinel, 0, this._endSentinel.length);

		const finalArr = new Uint8Array(ms);
		this.writeToStream(finalArr);
	}

	private _writeRecord(writer: { writeByte(b: number): void; writeRawLong(v: number): void }, record: DwgSectionLocatorRecord): void {
		writer.writeByte(record.number!);
		writer.writeRawLong(record.seeker);
		writer.writeRawLong(record.stream?.length ?? 0);
	}

	private _writeRecordStreams(): void {
		for (const [, item] of this._records) {
			if (item.stream == null) continue;
			this.writeToStream(item.stream);
		}
	}
}
