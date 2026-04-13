import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';

export class ExtendedDataInteger16 extends ExtendedDataRecordT<number> {
	public constructor(value: number) {
		super(DxfCode.ExtendedDataInteger16, value);
	}
}
