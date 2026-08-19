import { BlockActionBasePt } from './BlockActionBasePt.js';
import { EvalConnection } from './EvalConnection.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockScaleAction extends BlockActionBasePt {
	scaleConnection: EvalConnection = new EvalConnection();
	scaleType: number = 0;
	xScaleConnection: EvalConnection = new EvalConnection();
	yScaleConnection: EvalConnection = new EvalConnection();
	override get objectName(): string { return DxfFileToken.objectBlockScaleAction; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockScaleAction; }
}
