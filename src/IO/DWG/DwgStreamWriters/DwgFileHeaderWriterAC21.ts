import { CadDocument } from '../../../CadDocument.js';
import { DwgLZ77AC21Compressor } from './DwgLZ77AC21Compressor.js';
import { ICompressor } from './ICompressor.js';
import { DwgFileHeaderWriterAC18 } from './DwgFileHeaderWriterAC18.js';
import { DwgSectionDescriptor } from '../FileHeaders/DwgSectionDescriptor.js';

export class DwgFileHeaderWriterAC21 extends DwgFileHeaderWriterAC18 {
	override get fileHeaderSize(): number { return 0x480; }

	protected override get compressor(): ICompressor { return new DwgLZ77AC21Compressor(); }

	constructor(stream: Uint8Array, encoding: string, model: CadDocument) {
		super(stream, encoding, model);
	}

	protected override createLocalSection(descriptor: DwgSectionDescriptor, buffer: Uint8Array, decompressedSize: number, offset: number, totalSize: number, isCompressed: boolean): void {
		const descriptorStream = this.applyCompression(buffer, decompressedSize, offset, totalSize, isCompressed);

		this.writeMagicNumber();

		// Implementation for the LZ77 compressor for AC1021
		// modify the localsection writer to match this specific version
	}
}
