import { BlockElement } from './BlockElement.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { XYZ } from '../../Math/XYZ.js';

export abstract class BlockGrip extends BlockElement {
	location: XYZ = new XYZ(0, 0, 0);

	override get subclassMarker(): string { return DxfSubclassMarker.BlockGrip; }

	value280: number = 0;
	value91: number = 0;
	value92: number = 0;
	value93: number = 0;
}
