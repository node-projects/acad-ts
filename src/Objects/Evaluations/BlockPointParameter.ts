import { Block1PtParameter } from './Block1PtParameter.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { XYZ } from '../../Math/XYZ.js';

export class BlockPointParameter extends Block1PtParameter {
	description: string = '';
	label: string = '';
	labelPosition: XYZ = new XYZ(0, 0, 0);
	override get objectName(): string { return DxfFileToken.objectBlockPointParameter; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockPointParameter; }
}
