import { ICompressor } from './ICompressor.js';

export class DwgLZ77AC18Compressor implements ICompressor {
	private _source!: Uint8Array;

	private _dest!: number[];

	private _block: Int32Array = new Int32Array(0x8000);

	private _initialOffset: number = 0;

	private _currPosition: number = 0;

	private _currOffset: number = 0;

	private _totalOffset: number = 0;

	constructor() {
	}

	compress(source: Uint8Array, offset: number, totalSize: number, dest: number[]): void {
		this._restartBlock();

		this._source = source;
		this._dest = dest;

		this._initialOffset = offset;
		this._totalOffset = this._initialOffset + totalSize;
		this._currOffset = this._initialOffset;
		this._currPosition = this._initialOffset + 4;

		let compressionOffset = 0;
		let matchPos = 0;

		let currOffset = { value: 0 };
		let lastMatchPos = { value: 0 };

		while (this._currPosition < this._totalOffset - 0x13) {
			if (!this._compressChunk(currOffset, lastMatchPos)) {
				this._currPosition++;
				continue;
			}

			const mask = this._currPosition - this._currOffset;

			if (compressionOffset !== 0) {
				this._applyMask(matchPos, compressionOffset, mask);
			}

			this._writeLiteralLength(mask);
			this._currPosition += currOffset.value;
			this._currOffset = this._currPosition;
			compressionOffset = currOffset.value;
			matchPos = lastMatchPos.value;
		}

		const literalLength = this._totalOffset - this._currOffset;

		if (compressionOffset !== 0) {
			this._applyMask(matchPos, compressionOffset, literalLength);
		}

		this._writeLiteralLength(literalLength);

		//0x11 : Terminates the input stream.
		dest.push(0x11);
		dest.push(0);
		dest.push(0);
	}

	private _restartBlock(): void {
		this._block.fill(-1);
	}

	private _writeLen(len: number): void {
		if (len <= 0) {
			throw new Error('Invalid length');
		}

		while (len > 0xFF) {
			len -= 0xFF;
			this._dest.push(0);
		}

		this._dest.push(len & 0xFF);
	}

	private _writeOpCode(opCode: number, compressionOffset: number, value: number): void {
		if (compressionOffset <= 0) {
			throw new Error('Invalid compressionOffset');
		}

		if (value <= 0) {
			throw new Error('Invalid value');
		}

		if (compressionOffset <= value) {
			this._dest.push((opCode | (compressionOffset - 2)) & 0xFF);
		} else {
			this._dest.push(opCode & 0xFF);
			this._writeLen(compressionOffset - value);
		}
	}

	private _writeLiteralLength(length: number): void {
		if (length <= 0) return;

		if (length > 3) {
			this._writeOpCode(0, length - 1, 0x11);
		}
		let num = this._currOffset;
		for (let i = 0; i < length; i++) {
			this._dest.push(this._source[num]);
			num++;
		}
	}

	private _applyMask(matchPosition: number, compressionOffset: number, mask: number): void {
		let curr = 0;
		let next = 0;
		if (compressionOffset >= 0x0F || matchPosition > 0x400) {
			if (matchPosition <= 0x4000) {
				matchPosition--;
				//compressedBytes is read as the next Long Compression Offset + 0x21
				this._writeOpCode(0x20, compressionOffset, 0x21);
			} else {
				matchPosition -= 0x4000;
				//compressedBytes is read as the next Long Compression Offset, with 9 added
				this._writeOpCode(0x10 | ((matchPosition >>> 11) & 8), compressionOffset, 0x09);
			}

			//offset = (firstByte >> 2) | (readByte() << 6))
			curr = (matchPosition & 0xFF) << 2;
			next = matchPosition >>> 6;
		} else {
			matchPosition--;
			//compressedBytes = ((opcode1 & 0xF0) >> 4) – 1
			curr = ((compressionOffset + 1) << 4) | ((matchPosition & 0b11) << 2);
			next = matchPosition >>> 2;
		}

		if (mask < 4) {
			curr |= mask;
		}

		this._dest.push(curr & 0xFF);
		this._dest.push(next & 0xFF);
	}

	private _compressChunk(offset: { value: number }, matchPos: { value: number }): boolean {
		offset.value = 0;

		const v1 = this._source[this._currPosition + 3] << 6;
		const v2 = v1 ^ this._source[this._currPosition + 2];
		const v3 = (v2 << 5) ^ this._source[this._currPosition + 1];
		const v4 = (v3 << 5) ^ this._source[this._currPosition];
		let valueIndex = (v4 + (v4 >>> 5)) & 0x7FFF;

		let value = this._block[valueIndex];

		matchPos.value = this._currPosition - value;

		if (value >= this._initialOffset && matchPos.value <= 0xBFFF) {
			if (matchPos.value > 0x400 && this._source[this._currPosition + 3] !== this._source[value + 3]) {
				valueIndex = (valueIndex & 0x7FF) ^ 0b100000000011111;
				value = this._block[valueIndex];
				matchPos.value = this._currPosition - value;
				if (value < this._initialOffset ||
					matchPos.value > 0xBFFF ||
					(matchPos.value > 0x400 &&
					this._source[this._currPosition + 3] !== this._source[value + 3])) {
					this._block[valueIndex] = this._currPosition;
					return false;
				}
			}
			if (this._source[this._currPosition] === this._source[value] &&
				this._source[this._currPosition + 1] === this._source[value + 1] &&
				this._source[this._currPosition + 2] === this._source[value + 2]) {
				offset.value = 3;
				let index = value + 3;
				let currOff = this._currPosition + 3;
				while (currOff < this._totalOffset && this._source[index++] === this._source[currOff++]) {
					offset.value++;
				}
			}
		}

		this._block[valueIndex] = this._currPosition;
		return offset.value >= 3;
	}
}
