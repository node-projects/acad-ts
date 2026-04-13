import { ACadVersion } from '../../../ACadVersion.js';
import { DwgSectionIO } from '../DwgSectionIO.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { IDwgStreamReader } from './IDwgStreamReader.js';

export class DwgAppInfoReader extends DwgSectionIO {
	override get SectionName(): string {
		return DwgSectionDefinition.AppInfo;
	}

	private readonly _reader: IDwgStreamReader;

	constructor(version: ACadVersion, reader: IDwgStreamReader) {
		super(version);
		this._reader = reader;
	}

	public read(): void {
		if (!this.R2007Plus) {
			this.readR18();
		}

		const unknown1: number = this._reader.readInt();
		const infoname: string = this._reader.readTextUnicode();
		const unknown2: number = this._reader.readInt();
		const bytes: Uint8Array = this._reader.readBytes(16);
		const version: string = this._reader.readTextUnicode();
		const comm: Uint8Array = this._reader.readBytes(16);

		if (!this.R2010Plus) {
			return;
		}

		const comment: string = this._reader.readTextUnicode();
		const product: Uint8Array = this._reader.readBytes(16);
		const xml: string = this._reader.readTextUnicode();
	}

	private readR18(): void {
		const infoname: string = this._reader.readVariableText();
		const unknown2: number = this._reader.readInt();
		const version: string = this._reader.readVariableText();
		const xml: string = this._reader.readVariableText();
		const comment: string = this._reader.readVariableText();
	}
}
