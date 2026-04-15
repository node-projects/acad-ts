import { BlockElement } from './BlockElement.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { XYZ } from '../../Math/XYZ.js';
import { Entity } from '../../Entities/Entity.js';

export abstract class BlockAction extends BlockElement {
	actionPoint: XYZ = new XYZ(0, 0, 0);
	entities: Entity[] = [];

	override get subclassMarker(): string { return DxfSubclassMarker.BlockAction; }

	value70: number = 0;
}
