import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';

export class ExtendedDataString extends ExtendedDataRecordT<string> {
	public constructor(value: string) {
		super(DxfCode.ExtendedDataAsciiString, value);
	}
}
