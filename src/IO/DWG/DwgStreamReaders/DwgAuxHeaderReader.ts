import { ACadVersion } from '../../../ACadVersion.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { DwgSectionIO } from '../DwgSectionIO.js';
import { IDwgStreamReader } from './IDwgStreamReader.js';

export class DwgAuxHeaderReader extends DwgSectionIO {
	override get sectionName(): string { return DwgSectionDefinition.auxHeader; }

	constructor(version: ACadVersion, private readonly _reader: IDwgStreamReader) {
		super(version);
	}

	read(): void {
		this._reader.readByte();
		this._reader.readByte();
		this._reader.readByte();
		this._reader.readShort();
		this._readMaintenanceVersion();
		this._reader.readRawLong();
		this._reader.readRawLong();
		this._reader.readShort();
		this._reader.readShort();
		this._reader.readRawLong();
		this._reader.readShort();
		this._readMaintenanceVersion();
		this._reader.readShort();
		this._readMaintenanceVersion();

		for (let i = 0; i < 6; i++) this._reader.readShort();
		for (let i = 0; i < 5; i++) this._reader.readRawLong();

		this._reader.read8BitJulianDate();
		this._reader.read8BitJulianDate();

		this._reader.readRawLong();
		this._reader.readRawLong();
		this._reader.readShort();
		this._reader.readShort();
		for (let i = 0; i < 8; i++) this._reader.readRawLong();

		if (this.r2018Plus) {
			this._reader.readShort();
			this._reader.readShort();
			this._reader.readShort();
		}
	}

	private _readMaintenanceVersion(): number {
		return this._version > ACadVersion.AC1027
			? this._reader.readRawLong()
			: this._reader.readShort();
	}
}
