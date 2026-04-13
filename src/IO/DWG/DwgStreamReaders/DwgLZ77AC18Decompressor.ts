export class DwgLZ77AC18Decompressor {
	public static decompress(compressed: Uint8Array, compressedOffset: number, decompressedSize: number): Uint8Array {
		const result = new Uint8Array(decompressedSize);
		DwgLZ77AC18Decompressor.decompressToDest(compressed, compressedOffset, result);
		return result;
	}

	public static decompressToDest(src: Uint8Array, srcOffset: number, dst: Uint8Array): void {
		let srcPos = srcOffset;
		let dstPos = 0;
		let tempBuf = new Uint8Array(128);

		if (srcPos >= src.length) return;
		let opcode1 = src[srcPos++];

		if ((opcode1 & 0xF0) === 0) {
			const litCount = DwgLZ77AC18Decompressor.literalCount(opcode1, src, { pos: srcPos });
			srcPos = DwgLZ77AC18Decompressor._lastSrcPos;
			const result = DwgLZ77AC18Decompressor.copy(litCount + 3, src, srcPos, dst, dstPos, tempBuf);
			srcPos = result.srcPos;
			dstPos = result.dstPos;
			tempBuf = result.tempBuf as Uint8Array<ArrayBuffer>;
			opcode1 = result.nextByte;
		}

		while (opcode1 !== 0x11) {
			if (srcPos >= src.length) {
				throw new Error(`LZ77AC18: read past end of source at srcPos=${srcPos}, src.length=${src.length}`);
			}
			let compOffset = 0;
			let compressedBytes = 0;

			if (opcode1 < 0x10 || opcode1 >= 0x40) {
				compressedBytes = (opcode1 >> 4) - 1;
				const opcode2 = src[srcPos++];
				compOffset = ((opcode1 >> 2 & 3) | (opcode2 << 2)) + 1;
			} else if (opcode1 < 0x20) {
				const rbResult = DwgLZ77AC18Decompressor.readCompressedBytes(opcode1, 0b0111, src, { pos: srcPos });
				compressedBytes = rbResult.value;
				srcPos = rbResult.srcPos;
				compOffset = (opcode1 & 8) << 11;
				const tboResult = DwgLZ77AC18Decompressor.twoByteOffset(compOffset, 0x4000, src, srcPos);
				compOffset = tboResult.offset;
				opcode1 = tboResult.firstByte;
				srcPos = tboResult.srcPos;
			} else if (opcode1 >= 0x20) {
				const rbResult = DwgLZ77AC18Decompressor.readCompressedBytes(opcode1, 0b00011111, src, { pos: srcPos });
				compressedBytes = rbResult.value;
				srcPos = rbResult.srcPos;
				const tboResult = DwgLZ77AC18Decompressor.twoByteOffset(compOffset, 1, src, srcPos);
				compOffset = tboResult.offset;
				opcode1 = tboResult.firstByte;
				srcPos = tboResult.srcPos;
			}

			// Copy compressed bytes from earlier in dst
			const position = dstPos;
			if (tempBuf.length < compressedBytes) {
				tempBuf = new Uint8Array(compressedBytes);
			}

			// Read from dst at (position - compOffset)
			const readStart = position - compOffset;
			const readLen = Math.min(compressedBytes, compOffset);
			for (let i = 0; i < readLen; i++) {
				tempBuf[i] = dst[readStart + i];
			}

			let remaining = compressedBytes;
			let writePos = position;
			while (remaining > 0) {
				const writeLen = Math.min(remaining, compOffset);
				for (let i = 0; i < writeLen; i++) {
					dst[writePos + i] = tempBuf[i];
				}
				writePos += writeLen;
				remaining -= compOffset;
			}
			dstPos = position + compressedBytes;

			let litCount = opcode1 & 3;
			if (litCount === 0) {
				opcode1 = src[srcPos++];
				if ((opcode1 & 0b11110000) === 0) {
					const lcResult = DwgLZ77AC18Decompressor.literalCount(opcode1, src, { pos: srcPos });
					srcPos = DwgLZ77AC18Decompressor._lastSrcPos;
					litCount = lcResult + 3;
				}
			}

			if (litCount > 0) {
				const result = DwgLZ77AC18Decompressor.copy(litCount, src, srcPos, dst, dstPos, tempBuf);
				srcPos = result.srcPos;
				dstPos = result.dstPos;
				tempBuf = result.tempBuf as Uint8Array<ArrayBuffer>;
				opcode1 = result.nextByte;
			}
		}
	}

	private static _lastSrcPos: number = 0;

	private static copy(
		count: number, src: Uint8Array, srcPos: number,
		dst: Uint8Array, dstPos: number, tempBuf: Uint8Array
	): { srcPos: number; dstPos: number; tempBuf: Uint8Array; nextByte: number } {
		if (tempBuf.length < count) {
			tempBuf = new Uint8Array(count);
		}
		for (let i = 0; i < count; i++) {
			tempBuf[i] = src[srcPos + i];
			dst[dstPos + i] = src[srcPos + i];
		}
		srcPos += count;
		dstPos += count;
		const nextByte = src[srcPos++];
		return { srcPos, dstPos, tempBuf, nextByte };
	}

	private static literalCount(code: number, src: Uint8Array, ref: { pos: number }): number {
		let lowbits = code & 0b1111;
		if (lowbits === 0) {
			let lastByte: number;
			lastByte = src[ref.pos++];
			while (lastByte === 0) {
				lowbits += 0xFF;
				lastByte = src[ref.pos++];
			}
			lowbits += 0xF + lastByte;
		}
		DwgLZ77AC18Decompressor._lastSrcPos = ref.pos;
		return lowbits;
	}

	private static readCompressedBytes(
		opcode1: number, validBits: number, compressed: Uint8Array, ref: { pos: number }
	): { value: number; srcPos: number } {
		let compressedBytes = opcode1 & validBits;
		if (compressedBytes === 0) {
			let lastByte: number;
			lastByte = compressed[ref.pos++];
			while (lastByte === 0) {
				compressedBytes += 0xFF;
				lastByte = compressed[ref.pos++];
			}
			compressedBytes += lastByte + validBits;
		}
		return { value: compressedBytes + 2, srcPos: ref.pos };
	}

	private static twoByteOffset(
		offset: number, addedValue: number, stream: Uint8Array, srcPos: number
	): { offset: number; firstByte: number; srcPos: number } {
		const firstByte = stream[srcPos++];
		offset |= firstByte >> 2;
		offset |= stream[srcPos++] << 6;
		offset += addedValue;
		return { offset, firstByte, srcPos };
	}
}
