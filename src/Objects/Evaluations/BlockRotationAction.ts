import { BlockActionBasePt } from './BlockActionBasePt.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockRotationAction extends BlockActionBasePt {
	override get subclassMarker(): string { return DxfSubclassMarker.blockRotationAction; }

	value303: string = '';
	value94: number = 0;
}
