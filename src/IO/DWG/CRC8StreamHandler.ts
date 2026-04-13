import { CRC } from './CRC.js';

export class CRC8StreamHandler {
	private _data: Uint8Array;
	private _position: number = 0;
	Seed: number;

	get Length(): number { return this._data.length; }
	get Position(): number { return this._position; }
	set Position(value: number) { this._position = value; }

	constructor(data: Uint8Array, seed: number) {
		this._data = data;
		this.Seed = seed;
	}

	Read(buffer: Uint8Array, offset: number, count: number): number {
		const nbytes = Math.min(count, this._data.length - this._position);
		const length = offset + nbytes;

		for (let index = offset; index < length; ++index) {
			buffer[index] = this._data[this._position + (index - offset)];
			this.Seed = CRC8StreamHandler.decode(this.Seed, buffer[index]);
		}

		this._position += nbytes;
		return nbytes;
	}

	Write(buffer: Uint8Array, offset: number, count: number): void {
		const length = offset + count;

		for (let index = offset; index < length; ++index) {
			this.Seed = CRC8StreamHandler.decode(this.Seed, buffer[index]);
		}

		for (let i = 0; i < count; i++) {
			this._data[this._position + i] = buffer[offset + i];
		}
		this._position += count;
	}

	static GetCRCValue(seed: number, buffer: Uint8Array, startPos: number, endPos: number): number {
		let currValue = seed;
		let index = startPos;

		let remaining = endPos;
		while (remaining-- > 0) {
			currValue = CRC8StreamHandler.decode(currValue, buffer[index]);
			index++;
		}

		return currValue;
	}

	private static decode(key: number, value: number): number {
		const index = value ^ (key & 0xFF);
		key = ((key >>> 8) ^ CRC.CrcTable[index]) & 0xFFFF;
		return key;
	}
}
