import { ACadVersion } from '../../../ACadVersion.js';
import { NotificationType } from '../../NotificationEventHandler.js';
import { DwgSectionIO } from '../DwgSectionIO.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { IDwgStreamReader } from './IDwgStreamReader.js';

export class DwgHandleReader extends DwgSectionIO {
	override get sectionName(): string {
		return DwgSectionDefinition.handles;
	}

	private _sreader: IDwgStreamReader;

	constructor(version: ACadVersion, sreader: IDwgStreamReader) {
		super(version);
		this._sreader = sreader;
	}

	public read(): Map<number, number> {
		const objectMap: Map<number, number> = new Map<number, number>();

		while (true) {
			let lasthandle: number = 0;
			let lastloc: number = 0;

			const size: number = this._sreader.readShortBigEndian();

			if (size === 2) {
				break;
			}

			const startPos: number = this._sreader.position;
			let maxSectionOffset: number = size - 2;
			if (maxSectionOffset > 2032) {
				maxSectionOffset = 2032;
			}

			const lastPosition: number = startPos + maxSectionOffset;

			while (this._sreader.position < lastPosition) {
				const offset: number = this._sreader.readModularChar();
				lasthandle += offset;

				lastloc += this._sreader.readSignedModularChar();

				if (offset > 0) {
					objectMap.set(lasthandle, lastloc);
				} else {
					this.notify(`Negative offset: ${offset} for the handle: ${lasthandle}`, NotificationType.Warning);
				}
			}

			const crc: number = (this._sreader.readByte() << 8) + this._sreader.readByte();
		}

		return objectMap;
	}
}
