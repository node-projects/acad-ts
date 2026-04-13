import { BlockElement } from './BlockElement.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { XYZ } from '../../Math/XYZ.js';

export abstract class BlockAction extends BlockElement {
	actionPoint: XYZ = new XYZ(0, 0, 0);
	entities: any[] = [];

	override get subclassMarker(): string { return DxfSubclassMarker.BlockAction; }

	value70: number = 0;
}
