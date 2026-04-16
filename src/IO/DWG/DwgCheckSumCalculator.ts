export class DwgCheckSumCalculator {
	static readonly magicSequence: Uint8Array = (() => {
		const seq = new Uint8Array(256);
		let randSeed = 1;
		for (let i = 0; i < 256; i++) {
			randSeed = (randSeed * 0x343FD + 0x269EC3) | 0;
			seq[i] = (randSeed >> 0x10) & 0xFF;
		}
		return seq;
	})();

	static compressionCalculator(length: number): number {
		return 0x1F - (length + 0x20 - 1) % 0x20;
	}

	static calculate(seed: number, buffer: Uint8Array, offset: number, size: number): number {
		let sum1 = seed & 0xFFFF;
		let sum2 = (seed >>> 16) & 0xFFFF;
		let index = offset;
		let remaining = size;

		while (remaining !== 0) {
			const chunkSize = Math.min(0x15B0, remaining);
			remaining -= chunkSize;

			for (let i = 0; i < chunkSize; i++) {
				sum1 += buffer[index];
				sum2 += sum1;
				index++;
			}

			sum1 %= 0xFFF1;
			sum2 %= 0xFFF1;
		}

		return ((sum2 << 0x10) | (sum1 & 0xFFFF)) >>> 0;
	}
}
