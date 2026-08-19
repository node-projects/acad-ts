import { BlockElement } from './BlockElement.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export abstract class BlockParameter extends BlockElement {
	override get subclassMarker(): string { return DxfSubclassMarker.blockParameter; }

	value280: boolean = false;
	value281: boolean = false;
	get showProperties(): boolean { return this.value280; }
	set showProperties(value: boolean) { this.value280 = value; }
	get chainActions(): boolean { return this.value281; }
	set chainActions(value: boolean) { this.value281 = value; }
}
