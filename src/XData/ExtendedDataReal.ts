import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';

export class ExtendedDataReal extends ExtendedDataRecordT<number> {
	public constructor(value: number) {
		super(DxfCode.ExtendedDataReal, value);
	}
}
