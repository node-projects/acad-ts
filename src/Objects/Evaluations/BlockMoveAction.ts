import { BlockAction } from './BlockAction.js';
import { EvalConnection } from './EvalConnection.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockMoveAction extends BlockAction {
	angleOffset: number = 0;
	distanceMultiplier: number = 0;
	unknownFlag: number = 0;
	xDeltaConnection: EvalConnection = new EvalConnection();
	yDeltaConnection: EvalConnection = new EvalConnection();
	override get objectName(): string { return DxfFileToken.objectBlockMoveAction; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockMoveAction; }
}
