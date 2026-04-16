import { BlockGrip } from './BlockGrip.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockVisibilityGrip extends BlockGrip {
	override get objectName(): string { return DxfFileToken.objectBlockVisibilityGrip; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockVisibilityGrip; }
}
