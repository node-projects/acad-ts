export interface ICompressor {
	compress(source: Uint8Array, offset: number, totalSize: number, dest: number[]): void;
}
