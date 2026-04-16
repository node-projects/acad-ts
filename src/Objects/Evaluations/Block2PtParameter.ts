import { BlockParameter } from './BlockParameter.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { XYZ } from '../../Math/XYZ.js';

export abstract class Block2PtParameter extends BlockParameter {
	firstPoint: XYZ = new XYZ(0, 0, 0);
	secondPoint: XYZ = new XYZ(0, 0, 0);

	override get subclassMarker(): string { return DxfSubclassMarker.block2PtParameter; }

	value170: number = 0;
	value171: number = 0;
	value172: number = 0;
	value173: number = 0;
	value174: number = 0;
	value177: number = 0;
	value303: string = '';
	value304: string = '';
	value94: number = 0;
	value95: number = 0;
}
