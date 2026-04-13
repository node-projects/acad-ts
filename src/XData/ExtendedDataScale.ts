import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';

export class ExtendedDataScale extends ExtendedDataRecordT<number> {
	public constructor(value: number) {
		super(DxfCode.ExtendedDataScale, value);
	}
}
