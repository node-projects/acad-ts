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

	constructor(version: ACadVersion, stream: Uint8Array, encoding: string) {
		super(version);
		this._version = version;
		this._writer = DwgStreamWriterBase.getStreamWriter(version, stream, encoding);
	}

	write(summaryInfo: CadSummaryInfo): void {
		// ACadSharp always uses WriteTextUnicode for all versions >= AC1018
		this._writer.writeTextUnicode(summaryInfo.title ?? '');
		this._writer.writeTextUnicode(summaryInfo.subject ?? '');
		this._writer.writeTextUnicode(summaryInfo.author ?? '');
		this._writer.writeTextUnicode(summaryInfo.keywords ?? '');
		this._writer.writeTextUnicode(summaryInfo.comments ?? '');
		this._writer.writeTextUnicode(summaryInfo.lastSavedBy ?? '');
		this._writer.writeTextUnicode(summaryInfo.revisionNumber ?? '');
		this._writer.writeTextUnicode(summaryInfo.hyperlinkBase ?? '');

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
				this._writer.writeTextUnicode(name);
				this._writer.writeTextUnicode(value);
			}
		}

		// Two trailing unknown ints
		this._writer.writeInt(0);
		this._writer.writeInt(0);
	}
}
