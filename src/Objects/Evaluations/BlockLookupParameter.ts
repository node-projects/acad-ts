import { Block1PtParameter } from './Block1PtParameter.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockLookupParameter extends Block1PtParameter {
	actionId: number = 0;
	description: string = '';
	label: string = '';
	override get objectName(): string { return DxfFileToken.objectBlockLookupParameter; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockLookupParameter; }
}
