import { BlockGrip } from './BlockGrip.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockPolarGrip extends BlockGrip {
	override get objectName(): string { return DxfFileToken.objectBlockPolarGrip; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockPolarGrip; }
}
