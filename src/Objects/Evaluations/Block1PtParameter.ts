import { BlockParameter } from './BlockParameter.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { XYZ } from '../../Math/XYZ.js';

export abstract class Block1PtParameter extends BlockParameter {
	override get subclassMarker(): string { return DxfSubclassMarker.block1PtParameter; }

	location: XYZ = new XYZ(0, 0, 0);
	value93: number = 0;
	value170: number = 0;
	value171: number = 0;
}
