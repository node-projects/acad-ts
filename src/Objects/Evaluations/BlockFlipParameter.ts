import { Block2PtParameter } from './Block2PtParameter.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { XYZ } from '../../Math/XYZ.js';
import { EvalConnection } from './EvalConnection.js';

export class BlockFlipParameter extends Block2PtParameter {
	override get objectName(): string { return DxfFileToken.objectBlockFlipParameter; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockFlipParameter; }

	caption: string = '';
	description: string = '';
	baseStateName: string = '';
	flippedStateName: string = '';
	captionLocation: XYZ = new XYZ(0, 0, 0);
	caption309: string = '';
	value96: number = 0;
	caption1001: string = '';
	point1010: XYZ = new XYZ(0, 0, 0);
	updatedFlipConnection: EvalConnection = new EvalConnection();
	get label(): string { return this.caption; }
	set label(value: string) { this.caption = value; }
	get labelPosition(): XYZ { return this.captionLocation; }
	set labelPosition(value: XYZ) { this.captionLocation = value; }
}
