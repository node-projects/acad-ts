import { BlockAction } from './BlockAction.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { XYZ } from '../../Math/XYZ.js';

export abstract class BlockActionBasePt extends BlockAction {
	override get subclassMarker(): string { return DxfSubclassMarker.blockActionBasePt; }

	value1011: XYZ = new XYZ(0, 0, 0);
	value1012: XYZ = new XYZ(0, 0, 0);
	value280: boolean = false;
	value301: string = '';
	value302: string = '';
	value92: number = 0;
	value93: number = 0;
}
