import { CadDocument } from '../../../CadDocument.js';
import { ACadVersion } from '../../../ACadVersion.js';
import { DwgSectionIO } from '../DwgSectionIO.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { CRC8StreamHandler } from '../CRC8StreamHandler.js';
import { DwgStreamWriterBase } from './DwgStreamWriterBase.js';
import { IDwgStreamWriter } from './IDwgStreamWriter.js';

export class DwgClassesWriter extends DwgSectionIO {
	override get sectionName(): string { return DwgSectionDefinition.classes; }

	get bytesWritten(): number { return Math.ceil(this._startWriter.positionInBits / 8); }
	get startWriterStream(): ArrayBuffer { return this._startWriter.main.stream; }

	private _document: CadDocument;

	private _sectionBuffer: number[] = [];

	private _startWriter: IDwgStreamWriter;

	private _writer: IDwgStreamWriter;

	private readonly _startSentinel = new Uint8Array([
		0x8D, 0xA1, 0xC4, 0xB8, 0xC4, 0xA9, 0xF8, 0xC5, 0xC0, 0xDC, 0xF4, 0x5F, 0xE7, 0xCF, 0xB6, 0x8A
	]);

	private readonly _endSentinel = new Uint8Array([
		0x72, 0x5E, 0x3B, 0x47, 0x3B, 0x56, 0x07, 0x3A, 0x3F, 0x23, 0x0B, 0xA0, 0x18, 0x30, 0x49, 0x75
	]);

	constructor(stream: Uint8Array, document: CadDocument, encoding: string) {
		super(document.header.version);

		this._document = document;
		this._startWriter = DwgStreamWriterBase.getStreamWriter(this._version, stream, encoding);

		const sectionStream = new Uint8Array(4096);
		this._writer = DwgStreamWriterBase.getMergedWriter(this._version, sectionStream, encoding);
	}

	write(): void {
		if (this.r2007Plus) {
			this._writer.savePositonForSize();
		}

		let maxClassNumber = 0;
		const classesArr = [...this._document.classes];
		if (classesArr.length > 0) {
			maxClassNumber = Math.max(...classesArr.map(c => c.classNumber));
		}

		if (this.r2004Plus) {
			if (this.r2007Plus) {
				//BL : Maximum class number
				this._writer.writeBitLong(maxClassNumber);
				//B : true
				this._writer.writeBit(true);
			} else {
				//BS : Maximum class number
				this._writer.writeBitShort(maxClassNumber);
				//RC: 0x00
				this._writer.writeByte(0);
				//RC: 0x00
				this._writer.writeByte(0);
				//B : true
				this._writer.writeBit(true);
			}
		}

		for (const c of classesArr) {
			//BS : classnum
			this._writer.writeBitShort(c.classNumber);
			//BS : version
			this._writer.writeBitShort(c.proxyFlags);
			//TV : appname
			this._writer.writeVariableText(c.applicationName);
			//TV: cplusplusclassname
			this._writer.writeVariableText(c.cppClassName);
			//TV : classdxfname
			this._writer.writeVariableText(c.dxfName);
			//B : wasazombie
			this._writer.writeBit(c.wasZombie);
			//BS : itemclassid
			this._writer.writeBitShort(c.itemClassId);

			if (this.r2004Plus) {
				//BL : Number of objects created of this type
				this._writer.writeBitLong(c.instanceCount);
				//BS : Dwg Version
				this._writer.writeBitLong(c.dwgVersion);
				//BS : Maintenance release version.
				this._writer.writeBitLong(c.maintenanceVersion);
				//BL : Unknown
				this._writer.writeBitLong(0);
				//BL : Unknown
				this._writer.writeBitLong(0);
			}
		}

		this._writer.writeSpearShift();

		this._writeSizeAndCrc();
	}

	private _writeSizeAndCrc(): void {
		//SN : start sentinel
		this._startWriter.writeBytes(this._startSentinel);

		const writtenByteCount = Math.ceil(this._writer.main.positionInBits / 8);
		const sectionData = new Uint8Array(this._writer.main.stream).slice(0, writtenByteCount);
		const sectionLength = sectionData.length;

		// Write size with CRC
		const sizeBytes = new Uint8Array(4);
		const sizeView = new DataView(sizeBytes.buffer);
		sizeView.setInt32(0, sectionLength, true);

		// Calculate CRC on size + section data
		const crcData: number[] = [];
		for (let i = 0; i < 4; i++) crcData.push(sizeBytes[i]);

		if (this._document.header.version >= ACadVersion.AC1024
			&& this._document.header.maintenanceVersion > 3
			|| this._document.header.version > ACadVersion.AC1027) {
			// 4 unknown bytes
			for (let i = 0; i < 4; i++) crcData.push(0);
		}

		for (let i = 0; i < sectionLength; i++) crcData.push(sectionData[i]);

		const crcVal = CRC8StreamHandler.getCRCValue(0xC0C1, new Uint8Array(crcData), 0, crcData.length);

		this._startWriter.writeBytes(sizeBytes);

		if (this._document.header.version >= ACadVersion.AC1024
			&& this._document.header.maintenanceVersion > 3
			|| this._document.header.version > ACadVersion.AC1027) {
			this._startWriter.writeRawLong(0);
		}

		this._startWriter.writeBytes(sectionData);

		//RS: CRC
		this._startWriter.writeRawShort(crcVal);

		this._startWriter.writeBytes(this._endSentinel);

		if (this.r2004Plus) {
			//For R18 and later 8 unknown bytes follow.
			this._startWriter.writeRawLong(0);
			this._startWriter.writeRawLong(0);
		}
	}
}
