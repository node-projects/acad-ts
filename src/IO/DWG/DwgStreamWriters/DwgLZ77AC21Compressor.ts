import { ICompressor } from './ICompressor.js';

// Literal permutations from ACadSharp's copyLiterals1..32 routines.
const literalOrder: readonly number[][] = [
	[],
	[0],
	[1,0],
	[2,1,0],
	[0,1,2,3],
	[1,2,3,4,0],
	[5,1,2,3,4,0],
	[6,2,3,4,5,1,0],
	[0,1,2,3,4,5,6,7],
	[1,2,3,4,5,6,7,8,0],
	[9,1,2,3,4,5,6,7,8,0],
	[10,2,3,4,5,6,7,8,9,1,0],
	[4,5,6,7,8,9,10,11,0,1,2,3],
	[5,6,7,8,9,10,11,12,1,2,3,4,0],
	[13,5,6,7,8,9,10,11,12,1,2,3,4,0],
	[14,6,7,8,9,10,11,12,13,2,3,4,5,1,0],
	[8,9,10,11,12,13,14,15,0,1,2,3,4,5,6,7],
	[9,10,11,12,13,14,15,16,8,0,1,2,3,4,5,6,7],
	[17,9,10,11,12,13,14,15,16,1,2,3,4,5,6,7,8,0],
	[11,12,13,14,15,16,17,18,3,4,5,6,7,8,9,10,2,1,0],
	[12,13,14,15,16,17,18,19,4,5,6,7,8,9,10,11,0,1,2,3],
	[13,14,15,16,17,18,19,20,5,6,7,8,9,10,11,12,1,2,3,4,0],
	[14,15,16,17,18,19,20,21,6,7,8,9,10,11,12,13,2,3,4,5,1,0],
	[15,16,17,18,19,20,21,22,7,8,9,10,11,12,13,14,3,4,5,6,2,1,0],
	[16,17,18,19,20,21,22,23,8,9,10,11,12,13,14,15,0,1,2,3,4,5,6,7],
	[17,18,19,20,21,22,23,24,9,10,11,12,13,14,15,16,8,0,1,2,3,4,5,6,7],
	[18,19,20,21,22,23,24,25,10,11,12,13,14,15,16,17,9,1,2,3,4,5,6,7,8,0],
	[19,20,21,22,23,24,25,26,11,12,13,14,15,16,17,18,10,2,3,4,5,6,7,8,9,1,0],
	[20,21,22,23,24,25,26,27,12,13,14,15,16,17,18,19,4,5,6,7,8,9,10,11,0,1,2,3],
	[21,22,23,24,25,26,27,28,13,14,15,16,17,18,19,20,5,6,7,8,9,10,11,12,1,2,3,4,0],
	[22,23,24,25,26,27,28,29,14,15,16,17,18,19,20,21,6,7,8,9,10,11,12,13,2,3,4,5,1,0],
	[30,29,21,22,23,24,25,26,27,28,13,14,15,16,17,18,19,20,5,6,7,8,9,10,11,12,1,2,3,4,0],
	[24,25,26,27,28,29,30,31,16,17,18,19,20,21,22,23,8,9,10,11,12,13,14,15,0,1,2,3,4,5,6,7]
];

/** AC21 LZ77 compression, with four hash candidates and a 64 KiB window. */
export class DwgLZ77AC21Compressor implements ICompressor {
	private readonly hashTable = new Int32Array(524288);

	compress(source: Uint8Array, offset: number, totalSize: number, dest: number[]): void {
		if (!Number.isInteger(offset) || !Number.isInteger(totalSize) || offset < 0 || totalSize < 0 || offset + totalSize > source.length) {
			throw new RangeError('Invalid AC21 compression source range');
		}
		if (totalSize === 0) return;
		this.hashTable.fill(-1);
		const end = offset + totalSize, outputStart = dest.length;
		let position = offset, first = true, pending = 0;
		const write = (value: number) => {
			if (!first) dest.push(pending);
			first = false;
			pending = value & 255;
		};
		const literalLength = (count: number) => {
			if (count <= 7) {
				if (dest.length === outputStart) { write(32); write(0); write(0); write(0); }
				pending |= count;
			} else if (count <= 22) write(count - 8);
			else if (count < 278) { write(15); write(count - 23); }
			else {
				write(15); write(255);
				let remaining = count - 278;
				while (remaining >= 65535) { write(255); write(255); remaining -= 65535; }
				write(remaining); write(remaining >> 8);
			}
		};
		const literals = (start: number, count: number) => {
			while (count > 0) {
				const size = Math.min(32, count);
				for (const index of literalOrder[size]) write(source[start + index]);
				start += size; count -= size;
			}
		};
		const match = (distance: number, length: number, literalCount: number) => {
			const relative = distance - 1;
			if ((length < 15 || (length === 15 && literalCount !== 0)) && distance < 513) {
				write((length << 4) | (relative & 15)); write((relative >> 1) & 248);
			} else if (length <= 18 && distance < 8193) {
				write((length - 3) | 16); write(relative); write((relative >> 5) & 248);
			} else if (length <= 50 && distance < 4097) {
				write(literalCount === 0 ? (length - 3) | 240 : (length - 3) & 15);
				write(relative); write((((length + 13) << 3) & 128) | ((relative >> 5) & 120));
			} else if (length <= 255) {
				write((length & 7) | 32); write(distance); write(distance >> 8); write(length & 248);
			} else {
				write((length & 7) | 40); write(relative); write(relative >> 8);
				write((length - 256) >> 3); write(((length - 256) >> 8) & 248);
			}
		};
		const hash = (index: number) => ((source[index] | source[index + 1] << 8 | source[index + 2] << 16) & 0x1ffff) << 2;
		if (totalSize < 3) {
			literalLength(totalSize); literals(offset, totalSize); dest.push(pending); return;
		}
		this.hashTable[hash(position)] = position++;
		let literalCount = 1;
		while (position <= end - 3) {
			const index = hash(position);
			let length = 0, distance = 0, slot = 0;
			for (; slot < 4; slot++) {
				const candidate = this.hashTable[index + slot];
				if (candidate === -1) break;
				const delta = position - candidate;
				if (delta <= 65535 && source[candidate] === source[position] &&
					source[candidate + 1] === source[position + 1] && source[candidate + 2] === source[position + 2] &&
					(delta <= 8192 || (position + 3 < end && source[candidate + 3] === source[position + 3]))) {
					let current = position + 3;
					const limit = Math.min(end, position + 65791);
					while (current < limit && source[current] === source[current - delta]) current++;
					if (current - position > length) { length = current - position; distance = delta; }
					if (length > 15) break;
				}
			}
			if (length === 0 && slot < 4) this.hashTable[index + slot] = position;
			else {
				for (let i = 3; i > 0; i--) this.hashTable[index + i] = this.hashTable[index + i - 1];
				this.hashTable[index] = position;
			}
			if (!length) { position++; literalCount++; continue; }
			if (literalCount) { literalLength(literalCount); literals(position - literalCount, literalCount); }
			match(distance, length, literalCount);
			position += length; literalCount = 0;
		}
		literalCount += end - position;
		if (literalCount) { literalLength(literalCount); literals(end - literalCount, literalCount); }
		dest.push(pending);
	}
}
