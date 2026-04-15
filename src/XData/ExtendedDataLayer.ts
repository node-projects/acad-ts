import { DxfCode } from '../DxfCode.js';
import { ExtendedDataReference } from './ExtendedDataReference.js';
import { Layer } from '../Tables/Layer.js';

export class ExtendedDataLayer extends ExtendedDataReference<Layer> {
	public constructor(handle: number) {
		super(DxfCode.ExtendedDataLayerName, handle);
	}
}
