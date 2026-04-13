import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';

export class ExtendedDataBinaryChunk extends ExtendedDataRecordT<Uint8Array> {
	public constructor(chunk: Uint8Array) {
		super(DxfCode.ExtendedDataBinaryChunk, chunk);
	}
}
