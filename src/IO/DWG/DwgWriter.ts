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
import { ViewportEntityControl } from '../../Tables/Collections/ViewportEntityControl.js';
import './DwgStreamWriters/DwgStreamWriterFactory.js';

export class DwgWriter extends CadWriterBase<DwgWriterConfiguration> {
	preview: DwgPreview | null = null;

	private get _version(): ACadVersion { return this._document.header.version; }

	private _fileHeader!: DwgFileHeader;
	private _fileHeaderWriter!: IDwgFileHeaderWriter;
	private _handlesMap: Map<number, number> = new Map();

	/** The actual number of bytes written to the output stream after Write() completes. */
	get bytesWritten(): number { return this._fileHeaderWriter?.bytesWritten ?? 0; }

	constructor(stream: ArrayBuffer | Uint8Array, document: CadDocument) {
		super(stream, document);
		this._fileHeader = DwgFileHeader.createFileHeader(this._version)!;
	}

	protected createDefaultConfiguration(): DwgWriterConfiguration {
		return new DwgWriterConfiguration();
	}

	override write(): void {
		super.write();

		if (this._version < ACadVersion.AC1018 && !this._document.vEntityControl) {
			const viewportEntityControl = new ViewportEntityControl();
			this._document.registerCollection(viewportEntityControl);
			this._document.vEntityControl = viewportEntityControl;
		}

		this._getFileHeaderWriter();

		this._writeHeader();
		this._writeClasses();
		this._writeSummaryInfo();
		this._writePreview();
		this._writeAppInfo();
		this._writeFileDepList();
		this._writeRevHistory();
		this._writeAuxHeader();
		this._writeObjects();
		this._writeObjFreeSpace();
		this._writeTemplate();
		this._writeHandles();

		this._fileHeaderWriter.writeFile();
	}

	dispose(): void {
		// No-op in TS
	}

	static writeToStream(stream: ArrayBuffer | Uint8Array, document: CadDocument, configuration: DwgWriterConfiguration | null = null, notification: NotificationEventHandler | null = null): void {
		const writer = new DwgWriter(stream, document);
		if (configuration) {
			writer.configuration = configuration;
		}
		writer.onNotification = notification;
		writer.write();
		writer.dispose();
	}

	private _getFileHeaderWriter(): void {
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

	private _writeHeader(): void {
		const stream = new Uint8Array(0);
		const writer = new DwgHeaderWriter(stream, this._document, this._encoding);
		writer.onNotification = (sender, e) => this.triggerNotification(sender, e);
		writer.write();

		const data = new Uint8Array(writer.startWriterStream).slice(0, writer.bytesWritten);
		this._fileHeaderWriter.addSection(DwgSectionDefinition.header, data, true);
	}

	private _writeClasses(): void {
		const stream = new Uint8Array(0);
		const writer = new DwgClassesWriter(stream, this._document, this._encoding);
		writer.write();

		const data = new Uint8Array(writer.startWriterStream).slice(0, writer.bytesWritten);
		this._fileHeaderWriter.addSection(DwgSectionDefinition.classes, data, true);
	}

	private _writeSummaryInfo(): void {
		if (this._fileHeader.acadVersion < ACadVersion.AC1018) return;

		if (this._document.summaryInfo) {
			const stream = new Uint8Array(8192);
			const writer = new DwgSummaryInfoWriter(this._version, stream, this._encoding);
			writer.write(this._document.summaryInfo);
			const data = new Uint8Array(writer.writerStream).slice(0, writer.bytesWritten);
			this._fileHeaderWriter.addSection(DwgSectionDefinition.summaryInfo, data, false, 0x100);
		} else {
			this._fileHeaderWriter.addSection(DwgSectionDefinition.summaryInfo, new Uint8Array(0), false, 0x100);
		}
	}

	private _writePreview(): void {
		const stream = new Uint8Array(4096);
		const writer = new DwgPreviewWriter(this._version, stream);

		if (this.preview && this.preview.code !== 0) {
			writer.writePreview(this.preview, 0);
		} else {
			writer.write();
		}
		const data = new Uint8Array(writer.writerStream).slice(0, writer.bytesWritten);
		this._fileHeaderWriter.addSection(DwgSectionDefinition.preview, data, false, 0x400);
	}

	private _writeAppInfo(): void {
		if (this._fileHeader.acadVersion < ACadVersion.AC1018) return;

		const stream = new Uint8Array(4096);
		const writer = new DwgAppInfoWriter(this._version, stream);
		writer.write();

		const data = new Uint8Array(writer.writerStream).slice(0, writer.bytesWritten);
		this._fileHeaderWriter.addSection(DwgSectionDefinition.appInfo, data, false, 0x80);
	}

	private _writeFileDepList(): void {
		if (this._fileHeader.acadVersion < ACadVersion.AC1018) return;

		const data = new Uint8Array(8);
		const view = new DataView(data.buffer);
		// UInt32: Feature count
		view.setUint32(0, 0, true);
		// UInt32: File count
		view.setUint32(4, 0, true);

		this._fileHeaderWriter.addSection(DwgSectionDefinition.fileDepList, data, false, 0x80);
	}

	private _writeRevHistory(): void {
		if (this._fileHeader.acadVersion < ACadVersion.AC1018) return;

		const data = new Uint8Array(12);
		const view = new DataView(data.buffer);
		view.setUint32(0, 0, true);
		view.setUint32(4, 0, true);
		view.setUint32(8, 0, true);

		this._fileHeaderWriter.addSection(DwgSectionDefinition.revHistory, data, true);
	}

	private _writeObjects(): void {
		const stream = new Uint8Array(0);
		const writer = new DwgObjectWriter(
			stream,
			this._document,
			this._encoding,
			this.configuration.writeXRecords,
			this.configuration.writeXData,
			this.configuration.writeShapes,
		);
		writer.onNotification = (sender, e) => this.triggerNotification(sender, e);
		writer.write();

		this._handlesMap = writer.map;

		this._fileHeaderWriter.addSection(DwgSectionDefinition.acDbObjects, writer.getWrittenData(), true);
	}

	private _writeObjFreeSpace(): void {
		const data = new Uint8Array(53);
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
		// 8 x UInt32 values (ODA standard)
		view.setUint32(offset, 0x00000032, true); offset += 4;
		view.setUint32(offset, 0x00000000, true); offset += 4;
		view.setUint32(offset, 0x00000064, true); offset += 4;
		view.setUint32(offset, 0x00000000, true); offset += 4;
		view.setUint32(offset, 0x00000200, true); offset += 4;
		view.setUint32(offset, 0x00000000, true); offset += 4;
		view.setUint32(offset, 0xffffffff, true); offset += 4;
		view.setUint32(offset, 0x00000000, true); offset += 4;

		this._fileHeaderWriter.addSection(DwgSectionDefinition.objFreeSpace, data, true);
	}

	private _writeTemplate(): void {
		const data = new Uint8Array(4);
		const view = new DataView(data.buffer);
		// Int16: Template description string length (always 0)
		view.setInt16(0, 0, true);
		// UInt16: MEASUREMENT system variable (0 = English, 1 = Metric)
		view.setUint16(2, this._document.header.measurementUnits, true);

		this._fileHeaderWriter.addSection(DwgSectionDefinition.template, data, true);
	}

	private _writeHandles(): void {
		const writer = new DwgHandleWriter(this._version, this._handlesMap);
		const data = writer.write(this._fileHeaderWriter.handleSectionOffset);

		this._fileHeaderWriter.addSection(DwgSectionDefinition.handles, data, true);
	}

	private _writeAuxHeader(): void {
		const stream = new Uint8Array(4096);
		const writer = new DwgAuxHeaderWriter(stream, this._encoding, this._document.header);
		writer.write();

		const data = new Uint8Array(writer.writerStream).slice(0, writer.bytesWritten);
		this._fileHeaderWriter.addSection(DwgSectionDefinition.auxHeader, data, true);
	}
}
