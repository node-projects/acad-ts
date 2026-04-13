import { ACadVersion } from '../../ACadVersion.js';
import { CadDocument } from '../../CadDocument.js';
import { CadSummaryInfo } from '../../CadSummaryInfo.js';
import { CadUtils } from '../../CadUtils.js';
import { DwgPreview } from '../../DwgPreview.js';
import { CadNotSupportedException } from '../../Exceptions/CadNotSupportedException.js';
import { CadWriterBase } from '../CadWriterBase.js';
import { NotificationEventHandler } from '../NotificationEventHandler.js';
import { DwgFileHeader } from './FileHeaders/DwgFileHeader.js';
import './FileHeaders/DwgFileHeaderFactory.js';
import { DwgSectionDefinition } from './FileHeaders/DwgSectionDefinition.js';
import { DwgWriterConfiguration } from './DwgWriterConfiguration.js';
import { IDwgFileHeaderWriter } from './DwgStreamWriters/IDwgFileHeaderWriter.js';
import { DwgFileHeaderWriterAC15 } from './DwgStreamWriters/DwgFileHeaderWriterAC15.js';
import { DwgFileHeaderWriterAC18 } from './DwgStreamWriters/DwgFileHeaderWriterAC18.js';
import { DwgHeaderWriter } from './DwgStreamWriters/DwgHeaderWriter.js';
import { DwgClassesWriter } from './DwgStreamWriters/DwgClassesWriter.js';
import { DwgObjectWriter } from './DwgStreamWriters/DwgObjectWriter.js';
import { DwgHandleWriter } from './DwgStreamWriters/DwgHandleWriter.js';
import { DwgAuxHeaderWriter } from './DwgStreamWriters/DwgAuxHeaderWriter.js';
import { DwgPreviewWriter } from './DwgStreamWriters/DwgPreviewWriter.js';
import { DwgAppInfoWriter } from './DwgStreamWriters/DwgAppInfodWriter.js';
import { DwgSummaryInfoWriter } from './DwgStreamWriters/DwgSummaryInfoWriter.js';
import './DwgStreamWriters/DwgStreamWriterFactory.js';

export class DwgWriter extends CadWriterBase<DwgWriterConfiguration> {
	Preview: DwgPreview | null = null;

	private get _version(): ACadVersion { return this._document.header.version; }

	private _fileHeader!: DwgFileHeader;
	private _fileHeaderWriter!: IDwgFileHeaderWriter;
	private _handlesMap: Map<number, number> = new Map();

	/** The actual number of bytes written to the output stream after Write() completes. */
	get bytesWritten(): number { return this._fileHeaderWriter?.bytesWritten ?? 0; }

	constructor(stream: ArrayBuffer | Uint8Array, document: CadDocument) {
		super(stream, document);
		this._fileHeader = DwgFileHeader.CreateFileHeader(this._version)!;
	}

	protected createDefaultConfiguration(): DwgWriterConfiguration {
		return new DwgWriterConfiguration();
	}

	override Write(): void {
		super.Write();

		this.getFileHeaderWriter();

		this.writeHeader();
		this.writeClasses();
		this.writeSummaryInfo();
		this.writePreview();
		this.writeAppInfo();
		this.writeFileDepList();
		this.writeRevHistory();
		this.writeAuxHeader();
		this.writeObjects();
		this.writeObjFreeSpace();
		this.writeTemplate();
		this.writeHandles();

		this._fileHeaderWriter.writeFile();
	}

	Dispose(): void {
		// No-op in TS
	}

	static WriteToStream(stream: ArrayBuffer | Uint8Array, document: CadDocument, configuration: DwgWriterConfiguration | null = null, notification: NotificationEventHandler | null = null): void {
		const writer = new DwgWriter(stream, document);
		if (configuration) {
			writer.Configuration = configuration;
		}
		writer.OnNotification = notification;
		writer.Write();
		writer.Dispose();
	}

	private getFileHeaderWriter(): void {
		switch (this._document.header.version) {
			case ACadVersion.MC0_0:
			case ACadVersion.AC1_2:
			case ACadVersion.AC1_4:
			case ACadVersion.AC1_50:
			case ACadVersion.AC2_10:
			case ACadVersion.AC1002:
			case ACadVersion.AC1003:
			case ACadVersion.AC1004:
			case ACadVersion.AC1006:
			case ACadVersion.AC1009:
			case ACadVersion.AC1012:
				throw new CadNotSupportedException(this._document.header.version);
			case ACadVersion.AC1014:
			case ACadVersion.AC1015:
				this._fileHeaderWriter = new DwgFileHeaderWriterAC15(new Uint8Array(this._stream), this._encoding, this._document);
				break;
			case ACadVersion.AC1018:
				this._fileHeaderWriter = new DwgFileHeaderWriterAC18(new Uint8Array(this._stream), this._encoding, this._document);
				break;
			case ACadVersion.AC1021:
				// AC1021 writer currently uses AC18-compatible section/page layout.
				this._fileHeaderWriter = new DwgFileHeaderWriterAC18(new Uint8Array(this._stream), this._encoding, this._document);
				break;
			case ACadVersion.AC1024:
			case ACadVersion.AC1027:
			case ACadVersion.AC1032:
				this._fileHeaderWriter = new DwgFileHeaderWriterAC18(new Uint8Array(this._stream), this._encoding, this._document);
				break;
			default:
				throw new CadNotSupportedException();
		}
	}

	private writeHeader(): void {
		const stream = new Uint8Array(0);
		const writer = new DwgHeaderWriter(stream, this._document, this._encoding);
		writer.OnNotification = (sender, e) => this.triggerNotification(sender, e);
		writer.write();

		const data = new Uint8Array(writer.startWriterStream).slice(0, writer.bytesWritten);
		this._fileHeaderWriter.addSection(DwgSectionDefinition.Header, data, true);
	}

	private writeClasses(): void {
		const stream = new Uint8Array(0);
		const writer = new DwgClassesWriter(stream, this._document, this._encoding);
		writer.write();

		const data = new Uint8Array(writer.startWriterStream).slice(0, writer.bytesWritten);
		this._fileHeaderWriter.addSection(DwgSectionDefinition.Classes, data, true);
	}

	private writeSummaryInfo(): void {
		if (this._fileHeader.AcadVersion < ACadVersion.AC1018) return;

		if (this._document.summaryInfo) {
			const stream = new Uint8Array(8192);
			const writer = new DwgSummaryInfoWriter(this._version, stream);
			writer.write(this._document.summaryInfo);
			const data = new Uint8Array(writer.writerStream).slice(0, writer.bytesWritten);
			this._fileHeaderWriter.addSection(DwgSectionDefinition.SummaryInfo, data, false, 0x100);
		} else {
			this._fileHeaderWriter.addSection(DwgSectionDefinition.SummaryInfo, new Uint8Array(0), false, 0x100);
		}
	}

	private writePreview(): void {
		const stream = new Uint8Array(4096);
		const writer = new DwgPreviewWriter(this._version, stream);

		if (this.Preview && this.Preview.code !== 0) {
			writer.writePreview(this.Preview, 0);
		} else {
			writer.write();
		}
		const data = new Uint8Array(writer.writerStream).slice(0, writer.bytesWritten);
		this._fileHeaderWriter.addSection(DwgSectionDefinition.Preview, data, false, 0x400);
	}

	private writeAppInfo(): void {
		if (this._fileHeader.AcadVersion < ACadVersion.AC1018) return;

		const stream = new Uint8Array(4096);
		const writer = new DwgAppInfoWriter(this._version, stream);
		writer.write();

		const data = new Uint8Array(writer.writerStream).slice(0, writer.bytesWritten);
		this._fileHeaderWriter.addSection(DwgSectionDefinition.AppInfo, data, false, 0x80);
	}

	private writeFileDepList(): void {
		if (this._fileHeader.AcadVersion < ACadVersion.AC1018) return;

		const data = new Uint8Array(8);
		const view = new DataView(data.buffer);
		// UInt32: Feature count
		view.setUint32(0, 0, true);
		// UInt32: File count
		view.setUint32(4, 0, true);

		this._fileHeaderWriter.addSection(DwgSectionDefinition.FileDepList, data, false, 0x80);
	}

	private writeRevHistory(): void {
		if (this._fileHeader.AcadVersion < ACadVersion.AC1018) return;

		const data = new Uint8Array(12);
		const view = new DataView(data.buffer);
		view.setUint32(0, 0, true);
		view.setUint32(4, 0, true);
		view.setUint32(8, 0, true);

		this._fileHeaderWriter.addSection(DwgSectionDefinition.RevHistory, data, true);
	}

	private writeObjects(): void {
		const stream = new Uint8Array(0);
		const writer = new DwgObjectWriter(
			stream,
			this._document,
			this._encoding,
			this.Configuration.WriteXRecords,
			this.Configuration.WriteXData,
			this.Configuration.WriteShapes,
		);
		writer.OnNotification = (sender, e) => this.triggerNotification(sender, e);
		writer.write();

		this._handlesMap = writer.Map;

		this._fileHeaderWriter.addSection(DwgSectionDefinition.AcDbObjects, writer.getWrittenData(), true);
	}

	private writeObjFreeSpace(): void {
		const data = new Uint8Array(37);
		const view = new DataView(data.buffer);
		let offset = 0;

		// Int32: 0
		view.setInt32(offset, 0, true); offset += 4;
		// UInt32: Approximate number of objects (handle count)
		view.setUint32(offset, this._handlesMap.size, true); offset += 4;
		// Julian datetime (8 bytes)
		const dateToUse = this._version >= ACadVersion.AC1015
			? this._document.header.universalUpdateDateTime
			: this._document.header.updateDateTime;
		const { jdate, milliseconds } = CadUtils.dateToJulian(dateToUse);
		view.setInt32(offset, jdate, true); offset += 4;
		view.setInt32(offset, milliseconds, true); offset += 4;
		// UInt32: Offset of objects section in the stream
		view.setUint32(offset, 0, true); offset += 4;
		// UInt8: Number of 64-bit values that follow (ODA writes 4)
		data[offset] = 4; offset += 1;
		// 4 x UInt32 values (ODA standard)
		view.setUint32(offset, 0x00000032, true); offset += 4;
		view.setUint32(offset, 0x00000000, true); offset += 4;
		view.setUint32(offset, 0x00000064, true); offset += 4;
		view.setUint32(offset, 0x00000000, true); offset += 4;

		this._fileHeaderWriter.addSection(DwgSectionDefinition.ObjFreeSpace, data, true);
	}

	private writeTemplate(): void {
		const data = new Uint8Array(4);
		const view = new DataView(data.buffer);
		// Int16: Template description string length (always 0)
		view.setInt16(0, 0, true);
		// UInt16: MEASUREMENT system variable (0 = English, 1 = Metric)
		view.setUint16(2, this._document.header.measurementUnits, true);

		this._fileHeaderWriter.addSection(DwgSectionDefinition.Template, data, true);
	}

	private writeHandles(): void {
		const writer = new DwgHandleWriter(this._version, this._handlesMap);
		const data = writer.write(this._fileHeaderWriter.HandleSectionOffset);

		this._fileHeaderWriter.addSection(DwgSectionDefinition.Handles, data, true);
	}

	private writeAuxHeader(): void {
		const stream = new Uint8Array(4096);
		const writer = new DwgAuxHeaderWriter(stream, this._encoding, this._document.header);
		writer.write();

		const data = new Uint8Array(writer.writerStream).slice(0, writer.bytesWritten);
		this._fileHeaderWriter.addSection(DwgSectionDefinition.AuxHeader, data, true);
	}
}
