import { ACadVersion } from '../../../ACadVersion.js';
import { CadSummaryInfo } from '../../../CadSummaryInfo.js';
import { DwgSectionIO } from '../DwgSectionIO.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { DwgStreamWriterBase } from './DwgStreamWriterBase.js';
import { IDwgStreamWriter } from './IDwgStreamWriter.js';
import { encodeCadString } from '../../TextEncoding.js';

export class DwgSummaryInfoWriter extends DwgSectionIO {
	override get sectionName(): string { return DwgSectionDefinition.summaryInfo; }

	get bytesWritten(): number { return Math.ceil(this._writer.positionInBits / 8); }
	get writerStream(): ArrayBuffer { return this._writer.main.stream; }

	private _writer: IDwgStreamWriter;
	declare protected readonly _version: ACadVersion;
	private _writeStringMethod: (value: string) => void;
    private readonly _encoding: string;

	constructor(version: ACadVersion, stream: Uint8Array, encoding: string) {
		super(version);
		this._version = version;
		this._encoding = encoding;
		this._writer = DwgStreamWriterBase.getStreamWriter(version, stream, encoding);

		if (version < ACadVersion.AC1021) {
			this._writeStringMethod = (value: string) => this._writeUnicodeString(value);
		} else {
			this._writeStringMethod = (value: string) => this._writer.writeTextUnicode(value);
		}
	}

	write(summaryInfo: CadSummaryInfo): void {
		this._writeStringMethod(summaryInfo.title ?? '');
		this._writeStringMethod(summaryInfo.subject ?? '');
		this._writeStringMethod(summaryInfo.author ?? '');
		this._writeStringMethod(summaryInfo.keywords ?? '');
		this._writeStringMethod(summaryInfo.comments ?? '');
		this._writeStringMethod(summaryInfo.lastSavedBy ?? '');
		this._writeStringMethod(summaryInfo.revisionNumber ?? '');
		this._writeStringMethod(summaryInfo.hyperlinkBase ?? '');

		// Two unknown ints
		this._writer.writeInt(0);
		this._writer.writeInt(0);

		// Dates
		this._writer.write8BitJulianDate(summaryInfo.createdDate ?? new Date());
		this._writer.write8BitJulianDate(summaryInfo.modifiedDate ?? new Date());

		// Custom properties
		const nproperties = summaryInfo.properties?.size ?? 0;
		this._writer.writeRawShort(nproperties);
		if (summaryInfo.properties) {
			for (const [name, value] of summaryInfo.properties) {
				this._writeStringMethod(name);
				this._writeStringMethod(value);
			}
		}

		// Two trailing unknown ints
		this._writer.writeInt(0);
		this._writer.writeInt(0);
	}

	private _writeUnicodeString(value: string): void {
		const bytes = encodeCadString(value ?? '', this._encoding);
		this._writer.writeRawShort(bytes.length + 1);
		this._writer.writeBytes(bytes);
		this._writer.writeByte(0);
	}
}
