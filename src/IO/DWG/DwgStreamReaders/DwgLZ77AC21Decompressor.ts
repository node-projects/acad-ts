type CopyDelegate = (src: Uint8Array, srcIndex: number, dst: Uint8Array, dstIndex: number) => void;

export class DwgLZ77AC21Decompressor {
	private static _m_sourceOffset: number = 0;
	private static _m_length: number = 0;
	private static _m_sourceIndex: number = 0;
	private static _m_opCode: number = 0;

	public static decompress(source: Uint8Array, initialOffset: number, length: number, buffer: Uint8Array): void {
		DwgLZ77AC21Decompressor._m_sourceOffset = 0;
		DwgLZ77AC21Decompressor._m_length = 0;
		DwgLZ77AC21Decompressor._m_sourceIndex = initialOffset;
		DwgLZ77AC21Decompressor._m_opCode = source[DwgLZ77AC21Decompressor._m_sourceIndex];

		let destIndex: number = 0;
		const endIndex: number = DwgLZ77AC21Decompressor._m_sourceIndex + length;

		++DwgLZ77AC21Decompressor._m_sourceIndex;

		if (DwgLZ77AC21Decompressor._m_sourceIndex >= endIndex) {
			return;
		}

		if ((DwgLZ77AC21Decompressor._m_opCode & 240) === 32) {
			DwgLZ77AC21Decompressor._m_sourceIndex += 3;
			DwgLZ77AC21Decompressor._m_length = source[DwgLZ77AC21Decompressor._m_sourceIndex - 1];
			DwgLZ77AC21Decompressor._m_length &= 7;
		}

		while (DwgLZ77AC21Decompressor._m_sourceIndex < endIndex) {
			destIndex = DwgLZ77AC21Decompressor._nextIndex(source, buffer, destIndex);

			if (DwgLZ77AC21Decompressor._m_sourceIndex >= endIndex) {
				break;
			}

			destIndex = DwgLZ77AC21Decompressor._copyDecompressedChunks(source, endIndex, buffer, destIndex);
		}
	}

	private static _nextIndex(source: Uint8Array, dest: Uint8Array, index: number): number {
		if (DwgLZ77AC21Decompressor._m_length === 0) {
			DwgLZ77AC21Decompressor._readLiteralLength(source);
		}

		DwgLZ77AC21Decompressor._copyRaw(source, DwgLZ77AC21Decompressor._m_sourceIndex, dest, index, DwgLZ77AC21Decompressor._m_length);

		DwgLZ77AC21Decompressor._m_sourceIndex += DwgLZ77AC21Decompressor._m_length;
		index += DwgLZ77AC21Decompressor._m_length;
		return index;
	}

	private static _copyDecompressedChunks(src: Uint8Array, endIndex: number, dst: Uint8Array, destIndex: number): number {
		DwgLZ77AC21Decompressor._m_length = 0;
		DwgLZ77AC21Decompressor._m_opCode = src[DwgLZ77AC21Decompressor._m_sourceIndex];
		++DwgLZ77AC21Decompressor._m_sourceIndex;

		DwgLZ77AC21Decompressor._readInstructions(src);

		while (true) {
			DwgLZ77AC21Decompressor._copyBytes(dst, destIndex, DwgLZ77AC21Decompressor._m_length, DwgLZ77AC21Decompressor._m_sourceOffset);

			destIndex += DwgLZ77AC21Decompressor._m_length;

			DwgLZ77AC21Decompressor._m_length = DwgLZ77AC21Decompressor._m_opCode & 0x07;

			if (DwgLZ77AC21Decompressor._m_length !== 0 || DwgLZ77AC21Decompressor._m_sourceIndex >= endIndex) {
				break;
			}

			DwgLZ77AC21Decompressor._m_opCode = src[DwgLZ77AC21Decompressor._m_sourceIndex];
			++DwgLZ77AC21Decompressor._m_sourceIndex;

			if (DwgLZ77AC21Decompressor._m_opCode >> 4 === 0) {
				break;
			}

			if (DwgLZ77AC21Decompressor._m_opCode >> 4 === 15) {
				DwgLZ77AC21Decompressor._m_opCode &= 15;
			}

			DwgLZ77AC21Decompressor._readInstructions(src);
		}
		return destIndex;
	}

	private static _readInstructions(buffer: Uint8Array): void {
		switch (DwgLZ77AC21Decompressor._m_opCode >> 4) {
			case 0:
				DwgLZ77AC21Decompressor._m_length = (DwgLZ77AC21Decompressor._m_opCode & 0xF) + 0x13;
				DwgLZ77AC21Decompressor._m_sourceOffset = buffer[DwgLZ77AC21Decompressor._m_sourceIndex];
				++DwgLZ77AC21Decompressor._m_sourceIndex;
				DwgLZ77AC21Decompressor._m_opCode = buffer[DwgLZ77AC21Decompressor._m_sourceIndex];
				++DwgLZ77AC21Decompressor._m_sourceIndex;
				DwgLZ77AC21Decompressor._m_length = (DwgLZ77AC21Decompressor._m_opCode >> 3 & 0x10) + DwgLZ77AC21Decompressor._m_length;
				DwgLZ77AC21Decompressor._m_sourceOffset = ((DwgLZ77AC21Decompressor._m_opCode & 0x78) << 5) + 1 + DwgLZ77AC21Decompressor._m_sourceOffset;
				break;
			case 1:
				DwgLZ77AC21Decompressor._m_length = (DwgLZ77AC21Decompressor._m_opCode & 0xF) + 3;
				DwgLZ77AC21Decompressor._m_sourceOffset = buffer[DwgLZ77AC21Decompressor._m_sourceIndex];
				++DwgLZ77AC21Decompressor._m_sourceIndex;
				DwgLZ77AC21Decompressor._m_opCode = buffer[DwgLZ77AC21Decompressor._m_sourceIndex];
				++DwgLZ77AC21Decompressor._m_sourceIndex;
				DwgLZ77AC21Decompressor._m_sourceOffset = ((DwgLZ77AC21Decompressor._m_opCode & 248) << 5) + 1 + DwgLZ77AC21Decompressor._m_sourceOffset;
				break;
			case 2:
				DwgLZ77AC21Decompressor._m_sourceOffset = buffer[DwgLZ77AC21Decompressor._m_sourceIndex];
				++DwgLZ77AC21Decompressor._m_sourceIndex;
				DwgLZ77AC21Decompressor._m_sourceOffset = ((buffer[DwgLZ77AC21Decompressor._m_sourceIndex] << 8) & 0xFF00) | DwgLZ77AC21Decompressor._m_sourceOffset;
				++DwgLZ77AC21Decompressor._m_sourceIndex;
				DwgLZ77AC21Decompressor._m_length = DwgLZ77AC21Decompressor._m_opCode & 7;
				if ((DwgLZ77AC21Decompressor._m_opCode & 8) === 0) {
					DwgLZ77AC21Decompressor._m_opCode = buffer[DwgLZ77AC21Decompressor._m_sourceIndex];
					++DwgLZ77AC21Decompressor._m_sourceIndex;
					DwgLZ77AC21Decompressor._m_length = (DwgLZ77AC21Decompressor._m_opCode & 0xF8) + DwgLZ77AC21Decompressor._m_length;
				} else {
					++DwgLZ77AC21Decompressor._m_sourceOffset;
					DwgLZ77AC21Decompressor._m_length = ((buffer[DwgLZ77AC21Decompressor._m_sourceIndex] << 3) + DwgLZ77AC21Decompressor._m_length);
					++DwgLZ77AC21Decompressor._m_sourceIndex;
					DwgLZ77AC21Decompressor._m_opCode = buffer[DwgLZ77AC21Decompressor._m_sourceIndex];
					++DwgLZ77AC21Decompressor._m_sourceIndex;
					DwgLZ77AC21Decompressor._m_length = ((DwgLZ77AC21Decompressor._m_opCode & 0xF8) << 8) + DwgLZ77AC21Decompressor._m_length + 0x100;
				}
				break;
			default:
				DwgLZ77AC21Decompressor._m_length = DwgLZ77AC21Decompressor._m_opCode >> 4;
				DwgLZ77AC21Decompressor._m_sourceOffset = DwgLZ77AC21Decompressor._m_opCode & 15;
				DwgLZ77AC21Decompressor._m_opCode = buffer[DwgLZ77AC21Decompressor._m_sourceIndex];
				++DwgLZ77AC21Decompressor._m_sourceIndex;
				DwgLZ77AC21Decompressor._m_sourceOffset = ((DwgLZ77AC21Decompressor._m_opCode & 0xF8) << 1) + DwgLZ77AC21Decompressor._m_sourceOffset + 1;
				break;
		}
	}

	private static _readLiteralLength(buffer: Uint8Array): void {
		DwgLZ77AC21Decompressor._m_length = DwgLZ77AC21Decompressor._m_opCode + 8;
		if (DwgLZ77AC21Decompressor._m_length === 0x17) {
			let n: number = buffer[DwgLZ77AC21Decompressor._m_sourceIndex];
			++DwgLZ77AC21Decompressor._m_sourceIndex;
			DwgLZ77AC21Decompressor._m_length += n;

			if (n === 0xFF) {
				do {
					n = buffer[DwgLZ77AC21Decompressor._m_sourceIndex];
					++DwgLZ77AC21Decompressor._m_sourceIndex;
					n |= buffer[DwgLZ77AC21Decompressor._m_sourceIndex] << 8;
					++DwgLZ77AC21Decompressor._m_sourceIndex;
					DwgLZ77AC21Decompressor._m_length += n;
				} while (n === 0xFFFF);
			}
		}
	}

	private static _copyBytes(dst: Uint8Array, dstIndex: number, length: number, srcOffset: number): void {
		let initialIndex: number = dstIndex - srcOffset;
		const maxIndex: number = initialIndex + length;

		while (initialIndex < maxIndex) {
			dst[dstIndex++] = dst[initialIndex++];
		}
	}

	private static _copyRaw(src: Uint8Array, srcIndex: number, dst: Uint8Array, dstIndex: number, length: number): void {
		for (; length >= 32; length -= 32) {
			DwgLZ77AC21Decompressor._copy4b(src, srcIndex + 24, dst, dstIndex);
			DwgLZ77AC21Decompressor._copy4b(src, srcIndex + 28, dst, dstIndex + 4);
			DwgLZ77AC21Decompressor._copy4b(src, srcIndex + 16, dst, dstIndex + 8);
			DwgLZ77AC21Decompressor._copy4b(src, srcIndex + 20, dst, dstIndex + 12);
			DwgLZ77AC21Decompressor._copy4b(src, srcIndex + 8, dst, dstIndex + 16);
			DwgLZ77AC21Decompressor._copy4b(src, srcIndex + 12, dst, dstIndex + 20);
			DwgLZ77AC21Decompressor._copy4b(src, srcIndex, dst, dstIndex + 24);
			DwgLZ77AC21Decompressor._copy4b(src, srcIndex + 4, dst, dstIndex + 28);

			srcIndex += 32;
			dstIndex += 32;
		}
		if (length <= 0) {
			return;
		}

		DwgLZ77AC21Decompressor._m_copyMethods[length]!(src, srcIndex, dst, dstIndex);
	}

	private static _copy1b(src: Uint8Array, srcIndex: number, dst: Uint8Array, dstIndex: number): void {
		dst[dstIndex] = src[srcIndex];
	}

	private static _copy2b(src: Uint8Array, srcIndex: number, dst: Uint8Array, dstIndex: number): void {
		dst[dstIndex] = src[srcIndex + 1];
		dst[dstIndex + 1] = src[srcIndex];
	}

	private static _copy3b(src: Uint8Array, srcIndex: number, dst: Uint8Array, dstIndex: number): void {
		dst[dstIndex] = src[srcIndex + 2];
		dst[dstIndex + 1] = src[srcIndex + 1];
		dst[dstIndex + 2] = src[srcIndex];
	}

	private static _copy4b(src: Uint8Array, srcIndex: number, dst: Uint8Array, dstIndex: number): void {
		dst[dstIndex] = src[srcIndex];
		dst[dstIndex + 1] = src[srcIndex + 1];
		dst[dstIndex + 2] = src[srcIndex + 2];
		dst[dstIndex + 3] = src[srcIndex + 3];
	}

	private static _copy8b(src: Uint8Array, srcIndex: number, dst: Uint8Array, dstIndex: number): void {
		DwgLZ77AC21Decompressor._copy4b(src, srcIndex, dst, dstIndex);
		DwgLZ77AC21Decompressor._copy4b(src, srcIndex + 4, dst, dstIndex + 4);
	}

	private static _copy16b(src: Uint8Array, srcIndex: number, dst: Uint8Array, dstIndex: number): void {
		DwgLZ77AC21Decompressor._copy8b(src, srcIndex + 8, dst, dstIndex);
		DwgLZ77AC21Decompressor._copy8b(src, srcIndex, dst, dstIndex + 8);
	}

	private static readonly _m_copyMethods: (CopyDelegate | null)[] = [
		null,
		(src, si, dst, di) => { DwgLZ77AC21Decompressor._copy1b(src, si, dst, di); },
		(src, si, dst, di) => { DwgLZ77AC21Decompressor._copy2b(src, si, dst, di); },
		(src, si, dst, di) => { DwgLZ77AC21Decompressor._copy3b(src, si, dst, di); },
		(src, si, dst, di) => { DwgLZ77AC21Decompressor._copy4b(src, si, dst, di); },
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy1b(src, si + 4, dst, di);
			DwgLZ77AC21Decompressor._copy4b(src, si, dst, di + 1);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy1b(src, si + 5, dst, di);
			DwgLZ77AC21Decompressor._copy4b(src, si + 1, dst, di + 1);
			DwgLZ77AC21Decompressor._copy1b(src, si, dst, di + 5);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy2b(src, si + 5, dst, di);
			DwgLZ77AC21Decompressor._copy4b(src, si + 1, dst, di + 2);
			DwgLZ77AC21Decompressor._copy1b(src, si, dst, di + 6);
		},
		(src, si, dst, di) => { DwgLZ77AC21Decompressor._copy8b(src, si, dst, di); },
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy1b(src, si + 8, dst, di);
			DwgLZ77AC21Decompressor._copy8b(src, si, dst, di + 1);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy1b(src, si + 9, dst, di);
			DwgLZ77AC21Decompressor._copy8b(src, si + 1, dst, di + 1);
			DwgLZ77AC21Decompressor._copy1b(src, si, dst, di + 9);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy2b(src, si + 9, dst, di);
			DwgLZ77AC21Decompressor._copy8b(src, si + 1, dst, di + 2);
			DwgLZ77AC21Decompressor._copy1b(src, si, dst, di + 10);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy4b(src, si + 8, dst, di);
			DwgLZ77AC21Decompressor._copy8b(src, si, dst, di + 4);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy1b(src, si + 12, dst, di);
			DwgLZ77AC21Decompressor._copy4b(src, si + 8, dst, di + 1);
			DwgLZ77AC21Decompressor._copy8b(src, si, dst, di + 5);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy1b(src, si + 13, dst, di);
			DwgLZ77AC21Decompressor._copy4b(src, si + 9, dst, di + 1);
			DwgLZ77AC21Decompressor._copy8b(src, si + 1, dst, di + 5);
			DwgLZ77AC21Decompressor._copy1b(src, si, dst, di + 13);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy2b(src, si + 13, dst, di);
			DwgLZ77AC21Decompressor._copy4b(src, si + 9, dst, di + 2);
			DwgLZ77AC21Decompressor._copy8b(src, si + 1, dst, di + 6);
			DwgLZ77AC21Decompressor._copy1b(src, si, dst, di + 14);
		},
		(src, si, dst, di) => { DwgLZ77AC21Decompressor._copy16b(src, si, dst, di); },
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy8b(src, si + 9, dst, di);
			DwgLZ77AC21Decompressor._copy1b(src, si + 8, dst, di + 8);
			DwgLZ77AC21Decompressor._copy8b(src, si, dst, di + 9);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy1b(src, si + 17, dst, di);
			DwgLZ77AC21Decompressor._copy16b(src, si + 1, dst, di + 1);
			DwgLZ77AC21Decompressor._copy1b(src, si, dst, di + 17);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy3b(src, si + 16, dst, di);
			DwgLZ77AC21Decompressor._copy16b(src, si, dst, di + 3);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy4b(src, si + 16, dst, di);
			DwgLZ77AC21Decompressor._copy8b(src, si + 8, dst, di + 4);
			DwgLZ77AC21Decompressor._copy8b(src, si, dst, di + 12);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy1b(src, si + 20, dst, di);
			DwgLZ77AC21Decompressor._copy4b(src, si + 16, dst, di + 1);
			DwgLZ77AC21Decompressor._copy8b(src, si + 8, dst, di + 5);
			DwgLZ77AC21Decompressor._copy8b(src, si, dst, di + 13);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy2b(src, si + 20, dst, di);
			DwgLZ77AC21Decompressor._copy4b(src, si + 16, dst, di + 2);
			DwgLZ77AC21Decompressor._copy8b(src, si + 8, dst, di + 6);
			DwgLZ77AC21Decompressor._copy8b(src, si, dst, di + 14);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy3b(src, si + 20, dst, di);
			DwgLZ77AC21Decompressor._copy4b(src, si + 16, dst, di + 3);
			DwgLZ77AC21Decompressor._copy8b(src, si + 8, dst, di + 7);
			DwgLZ77AC21Decompressor._copy8b(src, si, dst, di + 15);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy8b(src, si + 16, dst, di);
			DwgLZ77AC21Decompressor._copy16b(src, si, dst, di + 8);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy8b(src, si + 17, dst, di);
			DwgLZ77AC21Decompressor._copy1b(src, si + 16, dst, di + 8);
			DwgLZ77AC21Decompressor._copy16b(src, si, dst, di + 9);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy1b(src, si + 25, dst, di);
			DwgLZ77AC21Decompressor._copy8b(src, si + 17, dst, di + 1);
			DwgLZ77AC21Decompressor._copy1b(src, si + 16, dst, di + 9);
			DwgLZ77AC21Decompressor._copy16b(src, si, dst, di + 10);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy2b(src, si + 25, dst, di);
			DwgLZ77AC21Decompressor._copy8b(src, si + 17, dst, di + 2);
			DwgLZ77AC21Decompressor._copy1b(src, si + 16, dst, di + 10);
			DwgLZ77AC21Decompressor._copy16b(src, si, dst, di + 11);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy4b(src, si + 24, dst, di);
			DwgLZ77AC21Decompressor._copy8b(src, si + 16, dst, di + 4);
			DwgLZ77AC21Decompressor._copy8b(src, si + 8, dst, di + 12);
			DwgLZ77AC21Decompressor._copy8b(src, si, dst, di + 20);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy1b(src, si + 28, dst, di);
			DwgLZ77AC21Decompressor._copy4b(src, si + 24, dst, di + 1);
			DwgLZ77AC21Decompressor._copy8b(src, si + 16, dst, di + 5);
			DwgLZ77AC21Decompressor._copy8b(src, si + 8, dst, di + 13);
			DwgLZ77AC21Decompressor._copy8b(src, si, dst, di + 21);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy2b(src, si + 28, dst, di);
			DwgLZ77AC21Decompressor._copy4b(src, si + 24, dst, di + 2);
			DwgLZ77AC21Decompressor._copy8b(src, si + 16, dst, di + 6);
			DwgLZ77AC21Decompressor._copy8b(src, si + 8, dst, di + 14);
			DwgLZ77AC21Decompressor._copy8b(src, si, dst, di + 22);
		},
		(src, si, dst, di) => {
			DwgLZ77AC21Decompressor._copy1b(src, si + 30, dst, di);
			DwgLZ77AC21Decompressor._copy4b(src, si + 26, dst, di + 1);
			DwgLZ77AC21Decompressor._copy8b(src, si + 18, dst, di + 5);
			DwgLZ77AC21Decompressor._copy8b(src, si + 10, dst, di + 13);
			DwgLZ77AC21Decompressor._copy8b(src, si + 2, dst, di + 21);
			DwgLZ77AC21Decompressor._copy2b(src, si, dst, di + 29);
		},
	];
}
