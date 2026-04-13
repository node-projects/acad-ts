import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';
import { XYZ } from '../Math/XYZ.js';

export class ExtendedDataDirection extends ExtendedDataRecordT<XYZ> {
	public constructor(direction: XYZ) {
		super(DxfCode.ExtendedDataWorldXDir, direction);
	}
}
