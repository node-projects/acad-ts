import { BlockGrip } from './BlockGrip.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockFlipGrip extends BlockGrip {
	override get subclassMarker(): string { return DxfSubclassMarker.BlockFlipGrip; }

	value140: number = 0;
	value141: number = 0;
	value142: number = 0;
	value93N: number = 0;
}
