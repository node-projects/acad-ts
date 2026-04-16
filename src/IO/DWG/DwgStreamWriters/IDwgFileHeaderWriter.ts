export interface IDwgFileHeaderWriter {
	handleSectionOffset: number;

	bytesWritten: number;

	addSection(name: string, stream: Uint8Array, isCompressed: boolean, decompsize?: number): void;

	writeFile(): void;
}
