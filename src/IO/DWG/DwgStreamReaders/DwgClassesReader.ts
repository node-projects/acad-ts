import { ACadVersion } from '../../../ACadVersion.js';
import { DxfClass } from '../../../Classes/DxfClass.js';
import { DxfClassCollection } from '../../../Classes/DxfClassCollection.js';
import { ProxyFlags } from '../../../Classes/ProxyFlags.js';
import { DwgSectionIO } from '../DwgSectionIO.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { DwgFileHeader } from '../FileHeaders/DwgFileHeader.js';
import { IDwgStreamReader } from './IDwgStreamReader.js';
import { DwgStreamReaderBase } from './DwgStreamReaderBase.js';
import { DwgMergedReader } from './DwgMergedReader.js';

export class DwgClassesReader extends DwgSectionIO {
	override get SectionName(): string {
		return DwgSectionDefinition.Classes;
	}

	private _fileHeader: DwgFileHeader;
	private _sreader: IDwgStreamReader;

	constructor(version: ACadVersion, sreader: IDwgStreamReader, fileHeader: DwgFileHeader) {
		super(version);
		this._sreader = sreader;
		this._fileHeader = fileHeader;
	}

	public read(): DxfClassCollection {
		const classes: DxfClassCollection = new DxfClassCollection();

		this.checkSentinel(this._sreader, DwgSectionDefinition.StartSentinels.get(this.SectionName)!);

		const size: number = this._sreader.readRawLong();
		let endSection: number = this._sreader.position + size;

		if (this._fileHeader.AcadVersion >= ACadVersion.AC1024
			&& this._fileHeader.AcadMaintenanceVersion > 3
			|| this._fileHeader.AcadVersion > ACadVersion.AC1027) {
			const unknown: number = this._sreader.readRawLong();
		}

		let flagPos: number = 0;
		if (this.R2007Plus) {
			flagPos = this._sreader.positionInBits() + this._sreader.readRawLong() - 1;
			const savedOffset: number = this._sreader.positionInBits();
			endSection = this._sreader.setPositionByFlag(flagPos);

			this._sreader.setPositionInBits(savedOffset);

			const textReader: IDwgStreamReader = DwgStreamReaderBase.getStreamHandler(
				this._version, this._sreader.stream);
			textReader.setPositionInBits(endSection);

			this._sreader = new DwgMergedReader(this._sreader, textReader, null!);

			this._sreader.readBitLong();
			this._sreader.readBit();
		}

		if (this._fileHeader.AcadVersion === ACadVersion.AC1018) {
			this._sreader.readBitShort();
			this._sreader.readRawChar();
			this._sreader.readRawChar();
			this._sreader.readBit();
		}

		while (this.getCurrPos(this._sreader) < endSection) {
			const dxfClass: DxfClass = new DxfClass();
			dxfClass.classNumber = this._sreader.readBitShort();
			dxfClass.proxyFlags = this._sreader.readBitShort() as ProxyFlags;

			dxfClass.applicationName = this._sreader.readVariableText();
			dxfClass.cppClassName = this._sreader.readVariableText();
			dxfClass.dxfName = this._sreader.readVariableText();

			dxfClass.wasZombie = this._sreader.readBit();
			dxfClass.itemClassId = this._sreader.readBitShort();

			if (this.R2004Plus) {
				dxfClass.instanceCount = this._sreader.readBitLong();
				dxfClass.dwgVersion = this._sreader.readBitLong() as ACadVersion;
				dxfClass.maintenanceVersion = this._sreader.readBitLong();
				this._sreader.readBitLong();
				this._sreader.readBitLong();
			}

			classes.addOrUpdate(dxfClass);
		}

		if (this.R2007Plus) {
			this._sreader.setPositionInBits(flagPos + 1);
		}

		this._sreader.resetShift();
		this.checkSentinel(this._sreader, DwgSectionDefinition.EndSentinels.get(this.SectionName)!);

		return classes;
	}

	private getCurrPos(sreader: IDwgStreamReader): number {
		if (this.R2007Plus) {
			return sreader.positionInBits();
		} else {
			return sreader.position;
		}
	}
}
