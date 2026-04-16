import { ACadVersion } from '../../../ACadVersion.js';
import { CadSummaryInfo } from '../../../CadSummaryInfo.js';
import { NotificationType } from '../../NotificationEventHandler.js';
import { DwgSectionIO } from '../DwgSectionIO.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { IDwgStreamReader } from './IDwgStreamReader.js';

export class DwgSummaryInfoReader extends DwgSectionIO {
	override get sectionName(): string {
		return DwgSectionDefinition.summaryInfo;
	}

	private _readStringMethod: () => string;
	private _reader: IDwgStreamReader;

	constructor(version: ACadVersion, reader: IDwgStreamReader) {
		super(version);
		this._reader = reader;

		if (version < ACadVersion.AC1021) {
			this._readStringMethod = () => this._readUnicodeString();
		} else {
			this._readStringMethod = () => this._reader.readTextUnicode();
		}
	}

	public read(): CadSummaryInfo {
		const summary: CadSummaryInfo = new CadSummaryInfo();

		try {
			summary.title = this._readStringMethod();
			summary.subject = this._readStringMethod();
			summary.author = this._readStringMethod();
			summary.keywords = this._readStringMethod();
			summary.comments = this._readStringMethod();
			summary.lastSavedBy = this._readStringMethod();
			summary.revisionNumber = this._readStringMethod();
			summary.hyperlinkBase = this._readStringMethod();

			this._reader.readInt();
			this._reader.readInt();

			summary.createdDate = this._reader.read8BitJulianDate();
			summary.modifiedDate = this._reader.read8BitJulianDate();

			const nproperties: number = this._reader.readShort();
			for (let i = 0; i < nproperties; i++) {
				const propName: string = this._readStringMethod();
				const propValue: string = this._readStringMethod();

				try {
					summary.properties.set(propName, propValue);
				} catch (ex) {
					this.notify('[SummaryInfo] An error ocurred while adding a property in the SummaryInfo',
						NotificationType.Error, ex instanceof Error ? ex : undefined);
				}
			}

			this._reader.readInt();
			this._reader.readInt();
		} catch (ex) {
			// In C# this checks Stream.Position != Stream.Length
			// We notify regardless since we can't easily check stream position
			this.notify('An error occurred while reading the Summary Info',
				NotificationType.Error, ex instanceof Error ? ex : undefined);
		}

		return summary;
	}

	private _readUnicodeString(): string {
		const textLength: number = this._reader.readShort();
		let value: string;
		if (textLength === 0) {
			value = '';
		} else {
			const bytes: Uint8Array = this._reader.readBytes(textLength);
			// Windows-1252 encoding - decode and strip null chars
			const decoder = new TextDecoder('windows-1252');
			value = decoder.decode(bytes).replace(/\0/g, '');
		}

		return value;
	}
}
