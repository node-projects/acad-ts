import { DxfCode } from '../DxfCode.js';
import { ExtendedDataReference } from './ExtendedDataReference.js';
import { CadObject } from '../CadObject.js';

export class ExtendedDataHandle extends ExtendedDataReference<CadObject> {
	public constructor(handle: number) {
		super(DxfCode.ExtendedDataHandle, handle);
	}
}
