import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';
import { XYZ } from '../Math/XYZ.js';

export class ExtendedDataDisplacement extends ExtendedDataRecordT<XYZ> {
	public constructor(displacement: XYZ) {
		super(DxfCode.ExtendedDataWorldXDisp, displacement);
	}
}
