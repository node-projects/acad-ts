import { ICompressor } from './ICompressor.js';

/**
 * @see DwgLZ77AC21Decompressor
 */
export class DwgLZ77AC21Compressor implements ICompressor {
	compress(source: Uint8Array, offset: number, totalSize: number, dest: number[]): void {
		throw new Error('AC1021 DWG compression is not supported yet.');
	}
}
