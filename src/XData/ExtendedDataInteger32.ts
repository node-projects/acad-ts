import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';

export class ExtendedDataInteger32 extends ExtendedDataRecordT<number> {
	public constructor(value: number) {
		super(DxfCode.ExtendedDataInteger32, value);
	}
}
