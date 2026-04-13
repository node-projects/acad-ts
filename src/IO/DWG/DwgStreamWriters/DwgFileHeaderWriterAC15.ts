import { CadDocument } from '../../../CadDocument.js';
import { DwgFileHeaderAC15 } from '../FileHeaders/DwgFileHeaderAC15.js';
import { DwgSectionLocatorRecord } from '../FileHeaders/DwgSectionLocatorRecord.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { CRC8StreamHandler } from '../CRC8StreamHandler.js';
import { DwgStreamWriterBase } from './DwgStreamWriterBase.js';
import { IDwgStreamWriter } from './IDwgStreamWriter.js';
import { DwgFileHeaderWriterBase } from './DwgFileHeaderWriterBase.js';

export class DwgFileHeaderWriterAC15 extends DwgFileHeaderWriterBase<DwgFileHeaderAC15> {
	override get FileHeaderSize(): number { return 0x61; }

	override get HandleSectionOffset(): number {
		return this.FileHeaderSize
			+ (this._records.get(DwgSectionDefinition.AuxHeader)!.Stream?.length ?? 0)
			+ (this._records.get(DwgSectionDefinition.Preview)!.Stream?.length ?? 0)
			+ (this._records.get(DwgSectionDefinition.Header)!.Stream?.length ?? 0)
			+ (this._records.get(DwgSectionDefinition.Classes)!.Stream?.length ?? 0);
	}

	private static readonly _nRecords = 6;

	private _endSentinel = new Uint8Array([
		0x95, 0xA0, 0x4E, 0x28, 0x99, 0x82, 0x1A, 0xE5, 0x5E, 0x41, 0xE0, 0x5F, 0x9D, 0x3A, 0x4D, 0x00
	]);

	private _records: Map<string, DwgSectionLocatorRecord> = new Map();

	constructor(stream: Uint8Array, encoding: string, document: CadDocument) {
		super(stream, encoding, document, new DwgFileHeaderAC15());

		this._records.set(DwgSectionDefinition.AuxHeader, new DwgSectionLocatorRecord(5));
		this._records.set(DwgSectionDefinition.Preview, new DwgSectionLocatorRecord(null));
		this._records.set(DwgSectionDefinition.Header, new DwgSectionLocatorRecord(0));
		this._records.set(DwgSectionDefinition.Classes, new DwgSectionLocatorRecord(1));
		this._records.set(DwgSectionDefinition.AcDbObjects, new DwgSectionLocatorRecord(null));
		this._records.set(DwgSectionDefinition.Handles, new DwgSectionLocatorRecord(2));
		this._records.set(DwgSectionDefinition.ObjFreeSpace, new DwgSectionLocatorRecord(3));
		this._records.set(DwgSectionDefinition.Template, new DwgSectionLocatorRecord(4));
	}

	override addSection(name: string, stream: Uint8Array, isCompressed: boolean, decompsize: number = 29696): void {
		this._records.get(name)!.Stream = stream;
	}

	override writeFile(): void {
		this.setSeekers();
		this.writeFileHeader();
		this.writeRecordStreams();
	}

	private setSeekers(): void {
		let currOffset = this.FileHeaderSize;
		for (const [, record] of this._records) {
			record.Seeker = currOffset;
			currOffset += (record.Stream?.length ?? 0);
		}
	}

	private writeFileHeader(): void {
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
		msWriter.writeRawLong(this._records.get(DwgSectionDefinition.Preview)!.Seeker);

		msWriter.writeByte(0x1B);
		msWriter.writeByte(0x19);

		//Code page at 0x13
		msWriter.writeRawShort(this.getFileCodePage());
		msWriter.writeRawLong(DwgFileHeaderWriterAC15._nRecords);

		this.writeRecord(msWriter, this._records.get(DwgSectionDefinition.Header)!);
		this.writeRecord(msWriter, this._records.get(DwgSectionDefinition.Classes)!);
		this.writeRecord(msWriter, this._records.get(DwgSectionDefinition.Handles)!);
		this.writeRecord(msWriter, this._records.get(DwgSectionDefinition.ObjFreeSpace)!);
		this.writeRecord(msWriter, this._records.get(DwgSectionDefinition.Template)!);
		this.writeRecord(msWriter, this._records.get(DwgSectionDefinition.AuxHeader)!);

		//Pad to align
		const bitPad = (8 - (ms.length * 8) % 8) % 8;
		if (bitPad > 0) {
			// writeSpearShift - pad to byte boundary (already at byte boundary in this array-based approach)
		}

		//CRC
		const msArr = new Uint8Array(ms);
		const crc = CRC8StreamHandler.GetCRCValue(0xC0C1, msArr, 0, msArr.length);
		msWriter.writeRawShort(crc);

		//End sentinel
		msWriter.writeBytes(this._endSentinel, 0, this._endSentinel.length);

		const finalArr = new Uint8Array(ms);
		this.writeToStream(finalArr);
	}

	private writeRecord(writer: { writeByte(b: number): void; writeRawLong(v: number): void }, record: DwgSectionLocatorRecord): void {
		writer.writeByte(record.Number!);
		writer.writeRawLong(record.Seeker);
		writer.writeRawLong(record.Stream?.length ?? 0);
	}

	private writeRecordStreams(): void {
		for (const [, item] of this._records) {
			if (item.Stream == null) continue;
			this.writeToStream(item.Stream);
		}
	}
}
