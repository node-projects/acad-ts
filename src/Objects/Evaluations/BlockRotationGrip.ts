import { BlockGrip } from './BlockGrip.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockRotationGrip extends BlockGrip {
	override get objectName(): string { return DxfFileToken.ObjectBlockRotationGrip; }
	override get subclassMarker(): string { return DxfSubclassMarker.BlockRotationGrip; }
}
