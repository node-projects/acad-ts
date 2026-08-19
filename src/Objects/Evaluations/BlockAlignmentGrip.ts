import { BlockGrip } from './BlockGrip.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockAlignmentGrip extends BlockGrip {
	alignmentX: number = 0;
	alignmentY: number = 0;
	alignmentZ: number = 0;
	override get objectName(): string { return DxfFileToken.objectBlockAlignmentGrip; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockAlignmentGrip; }
}
