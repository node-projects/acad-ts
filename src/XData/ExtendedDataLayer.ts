import { DxfCode } from '../DxfCode.js';
import { ExtendedDataReference } from './ExtendedDataReference.js';
import { CadObject } from '../CadObject.js';

// TODO: Layer type from Tables not yet converted, using CadObject as placeholder
export class ExtendedDataLayer extends ExtendedDataReference<CadObject /* Layer */> {
	public constructor(handle: number) {
		super(DxfCode.ExtendedDataLayerName, handle);
	}
}
