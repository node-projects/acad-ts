import { CRC } from './CRC.js';

export class CRC32StreamHandler {
	private _data: Uint8Array;
	private _position: number = 0;
	private _seed: number;

	get seed(): number { return (~this._seed) >>> 0; }

	get length(): number { return this._data.length; }
	get position(): number { return this._position; }
	set position(value: number) { this._position = value; }

	constructor(arr: Uint8Array, seed: number, decrypt: boolean = false) {
		if (decrypt) {
			let randSeed = 1;
			for (let index = 0; index < arr.length; ++index) {
				randSeed = (randSeed * 0x343fd + 0x269ec3) | 0;
				const values = (randSeed >> 0x10) & 0xFF;
				arr[index] = (arr[index] ^ values) & 0xFF;
			}
		}

		this._data = arr;
		this._seed = (~seed) >>> 0;
	}

	static fromStream(data: Uint8Array, seed: number): CRC32StreamHandler {
		const handler = new CRC32StreamHandler(data, seed, false);
		return handler;
	}

	read(buffer: Uint8Array, offset: number, count: number): number {
		const length = offset + count;
		const nbytes = Math.min(count, this._data.length - this._position);

		for (let index = 0; index < nbytes; ++index) {
			buffer[offset + index] = this._data[this._position + index];
			this._seed = ((this._seed >>> 8) ^ CRC.crc32Table[((this._seed ^ this._data[this._position + index]) & 0xFF)]) >>> 0;
		}

		this._position += nbytes;
		return nbytes;
	}

	write(buffer: Uint8Array, offset: number, count: number): void {
		const num = offset + count;
		for (let index = offset; index < num; ++index) {
			this._seed = ((this._seed >>> 8) ^ CRC.crc32Table[((this._seed ^ buffer[index]) & 0xFF)]) >>> 0;
		}

		for (let i = 0; i < count; i++) {
			this._data[this._position + i] = buffer[offset + i];
		}
		this._position += count;
	}
}
