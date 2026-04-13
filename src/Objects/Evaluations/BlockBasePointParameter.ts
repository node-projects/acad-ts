import { Block1PtParameter } from './Block1PtParameter.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { XYZ } from '../../Math/XYZ.js';

export class BlockBasePointParameter extends Block1PtParameter {
	override get objectName(): string { return DxfFileToken.ObjectBlockBasePointParameter; }
	override get subclassMarker(): string { return DxfSubclassMarker.BlockBasePointParameter; }

	point1010: XYZ = new XYZ(0, 0, 0);
	point1012: XYZ = new XYZ(0, 0, 0);
}
