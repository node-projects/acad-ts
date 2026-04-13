import { CadDocument } from '../../../CadDocument.js';
import { CadUtils } from '../../../CadUtils.js';
import { ACadVersion } from '../../../ACadVersion.js';
import { DwgFileHeader } from '../FileHeaders/DwgFileHeader.js';
import { DwgCheckSumCalculator } from '../DwgCheckSumCalculator.js';
import { IDwgFileHeaderWriter } from './IDwgFileHeaderWriter.js';

export abstract class DwgFileHeaderWriterBase<T extends DwgFileHeader> implements IDwgFileHeaderWriter {
	FileHeader: T;

	abstract get FileHeaderSize(): number;

	abstract get HandleSectionOffset(): number;

	get bytesWritten(): number { return this._streamPosition; }

	protected _document: CadDocument;

	protected _encoding: string;

	protected _stream: Uint8Array;
	protected _streamPosition: number = 0;

	protected _version: ACadVersion;

	constructor(stream: Uint8Array, encoding: string, model: CadDocument, fileHeader: T) {
		this._document = model;
		this._stream = stream;
		this._version = model.header.version;
		this._encoding = encoding;
		this.FileHeader = fileHeader;
	}

	abstract addSection(name: string, stream: Uint8Array, isCompressed: boolean, decompsize?: number): void;

	abstract writeFile(): void;

	protected applyMagicSequence(buffer: Uint8Array, length: number): void {
		for (let i = 0; i < length; i++) {
			buffer[i] ^= DwgCheckSumCalculator.MagicSequence[i];
		}
	}

	protected applyMask(buffer: Uint8Array, offset: number, length: number): void {
		const posValue = 0x4164536B ^ this._streamPosition;
		const maskBytes = new Uint8Array(4);
		const maskView = new DataView(maskBytes.buffer);
		maskView.setInt32(0, posValue, true);

		let diff = offset + length;
		while (offset < diff) {
			for (let i = 0; i < 4; i++) {
				buffer[offset + i] ^= maskBytes[i];
			}
			offset += 4;
		}
	}

	protected checkEmptyBytes(buffer: Uint8Array, offset: number, spearBytes: number): boolean {
		let result = true;
		const num = offset + spearBytes;

		for (let i = offset; i < num; i++) {
			if (buffer[i] !== 0) {
				result = false;
				break;
			}
		}

		return result;
	}

	protected getFileCodePage(): number {
		const codePage = CadUtils.getCodeIndex(CadUtils.getCodePage(this._document.header.codePage));
		if (codePage < 1) {
			return 30;
		} else {
			return codePage;
		}
	}

	protected writeMagicNumber(): void {
		const mod = this._streamPosition % 0x20;
		for (let i = 0; i < mod; i++) {
			this._stream[this._streamPosition++] = DwgCheckSumCalculator.MagicSequence[i];
		}
	}

	/** Write bytes to the output stream at current position */
	protected writeToStream(data: Uint8Array, offset: number = 0, length?: number): void {
		const len = length ?? data.length;
		for (let i = 0; i < len; i++) {
			this._stream[this._streamPosition++] = data[offset + i];
		}
	}

	/** Write a 32-bit unsigned int to the output stream */
	protected writeUint32ToStream(value: number): void {
		const view = new DataView(this._stream.buffer, this._stream.byteOffset + this._streamPosition, 4);
		view.setUint32(0, value >>> 0, true);
		this._streamPosition += 4;
	}

	/** Write a 32-bit signed int to the output stream */
	protected writeInt32ToStream(value: number): void {
		const view = new DataView(this._stream.buffer, this._stream.byteOffset + this._streamPosition, 4);
		view.setInt32(0, value, true);
		this._streamPosition += 4;
	}

	/** Write a 16-bit unsigned int to the output stream */
	protected writeUint16ToStream(value: number): void {
		const view = new DataView(this._stream.buffer, this._stream.byteOffset + this._streamPosition, 2);
		view.setUint16(0, value & 0xFFFF, true);
		this._streamPosition += 2;
	}

	/** Write a single byte to the output stream */
	protected writeByteToStream(value: number): void {
		this._stream[this._streamPosition++] = value & 0xFF;
	}
}
