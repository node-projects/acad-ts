import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';

export class ExtendedDataDistance extends ExtendedDataRecordT<number> {
	public constructor(value: number) {
		super(DxfCode.ExtendedDataDist, value);
	}
}
