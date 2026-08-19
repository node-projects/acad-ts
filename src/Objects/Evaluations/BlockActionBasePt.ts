import { BlockAction } from './BlockAction.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { XYZ } from '../../Math/XYZ.js';
import { EvalConnection } from './EvalConnection.js';

export abstract class BlockActionBasePt extends BlockAction {
	override get subclassMarker(): string { return DxfSubclassMarker.blockActionBasePt; }

	value1011: XYZ = new XYZ(0, 0, 0);
	value1012: XYZ = new XYZ(0, 0, 0);
	value280: boolean = false;
	value301: string = '';
	value302: string = '';
	value92: number = 0;
	value93: number = 0;
	updateBaseXConnection: EvalConnection = new EvalConnection();
	updateBaseYConnection: EvalConnection = new EvalConnection();
	get basePoint(): XYZ { return this.value1011; }
	set basePoint(value: XYZ) { this.value1011 = value; }
}
