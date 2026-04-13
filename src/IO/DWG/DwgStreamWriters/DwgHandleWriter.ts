import { ACadVersion } from '../../../ACadVersion.js';
import { DwgSectionIO } from '../DwgSectionIO.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { CRC8StreamHandler } from '../CRC8StreamHandler.js';

export class DwgHandleWriter extends DwgSectionIO {
	override get SectionName(): string { return DwgSectionDefinition.Handles; }

	private _buffer: number[] = [];

	private _handleMap: Map<number, number>;

	constructor(version: ACadVersion, handleMap: Map<number, number>) {
		super(version);

		// Sort by key
		this._handleMap = new Map(
			[...handleMap.entries()].sort((a, b) => a[0] - b[0])
		);
	}

	write(sectionOffset: number = 0): Uint8Array {
		const array = new Uint8Array(10);
		const array2 = new Uint8Array(5);

		let offset = 0;
		let initialLoc = 0;

		let lastPosition = this._buffer.length;

		this._buffer.push(0);
		this._buffer.push(0);

		for (const [key, value] of this._handleMap) {
			let handleOff = key - offset;
			const lastLoc = value + sectionOffset;
			let locDiff = lastLoc - initialLoc;

			let offsetSize = this.modularShortToValue(handleOff, array);
			let locSize = this.signedModularShortToValue(locDiff, array2);

			if (this._buffer.length - lastPosition + (offsetSize + locSize) > 2032) {
				this.processPosition(lastPosition);
				offset = 0;
				initialLoc = 0;
				lastPosition = this._buffer.length;
				this._buffer.push(0);
				this._buffer.push(0);
				offset = 0;
				initialLoc = 0;
				handleOff = key - offset;

				if (handleOff === 0) {
					throw new Error('Handle offset is zero');
				}

				locDiff = lastLoc - initialLoc;
				offsetSize = this.modularShortToValue(handleOff, array);
				locSize = this.signedModularShortToValue(locDiff, array2);
			}

			for (let i = 0; i < offsetSize; i++) {
				this._buffer.push(array[i]);
			}
			for (let i = 0; i < locSize; i++) {
				this._buffer.push(array2[i]);
			}
			offset = key;
			initialLoc = lastLoc;
		}

		this.processPosition(lastPosition);
		lastPosition = this._buffer.length;
		this._buffer.push(0);
		this._buffer.push(0);
		this.processPosition(lastPosition);

		return new Uint8Array(this._buffer);
	}

	private modularShortToValue(value: number, arr: Uint8Array): number {
		let i = 0;
		while (value >= 0b10000000) {
			arr[i] = ((value & 0b1111111) | 0b10000000) & 0xFF;
			i++;
			value = value >>> 7;
		}
		arr[i] = value & 0xFF;
		return i + 1;
	}

	private signedModularShortToValue(value: number, arr: Uint8Array): number {
		let i = 0;
		if (value < 0) {
			value = -value;
			while (value >= 64) {
				arr[i] = ((value & 0x7F) | 0x80) & 0xFF;
				i++;
				value = value >>> 7;
			}
			arr[i] = (value | 0x40) & 0xFF;
			return i + 1;
		}

		while (value >= 0b1000000) {
			arr[i] = ((value & 0x7F) | 0x80) & 0xFF;
			i++;
			value = value >>> 7;
		}

		arr[i] = value & 0xFF;
		return i + 1;
	}

	private processPosition(pos: number): void {
		const diff = this._buffer.length - pos;
		this._buffer[pos] = (diff >>> 8) & 0xFF;
		this._buffer[pos + 1] = diff & 0xFF;

		const bufferArr = new Uint8Array(this._buffer);
		const crc = CRC8StreamHandler.GetCRCValue(0xC0C1, bufferArr, pos, this._buffer.length - pos);
		this._buffer.push((crc >>> 8) & 0xFF);
		this._buffer.push(crc & 0xFF);
	}
}
