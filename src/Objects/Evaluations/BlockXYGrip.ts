import { BlockGrip } from './BlockGrip.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockXYGrip extends BlockGrip {
	override get objectName(): string { return DxfFileToken.objectBlockXYGrip; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockXYGrip; }
}
