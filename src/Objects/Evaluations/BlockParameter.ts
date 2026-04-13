import { BlockElement } from './BlockElement.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export abstract class BlockParameter extends BlockElement {
	override get subclassMarker(): string { return DxfSubclassMarker.BlockParameter; }

	value280: boolean = false;
	value281: boolean = false;
}
