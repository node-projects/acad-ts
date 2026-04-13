import { DxfCode } from '../DxfCode.js';
import { ExtendedDataRecordT } from './ExtendedDataRecordBase.js';
import { XYZ } from '../Math/XYZ.js';

export class ExtendedDataWorldCoordinate extends ExtendedDataRecordT<XYZ> {
	public constructor(coordinate: XYZ) {
		super(DxfCode.ExtendedDataWorldXCoordinate, coordinate);
	}
}
