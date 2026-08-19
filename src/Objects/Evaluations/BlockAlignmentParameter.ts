import { Block2PtParameter } from './Block2PtParameter.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockAlignmentParameter extends Block2PtParameter {
	isPerpendicular: boolean = false;
	override get objectName(): string { return DxfFileToken.objectBlockAlignmentParameter; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockAlignmentParameter; }
}
