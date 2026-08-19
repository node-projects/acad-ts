import { BlockAction } from './BlockAction.js';
import { EvalConnection } from './EvalConnection.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockArrayAction extends BlockAction {
	baseConnection: EvalConnection = new EvalConnection();
	columnOffset: number = 0;
	endConnection: EvalConnection = new EvalConnection();
	rowOffset: number = 0;
	updatedBaseConnection: EvalConnection = new EvalConnection();
	updatedEndConnection: EvalConnection = new EvalConnection();
	override get objectName(): string { return DxfFileToken.objectBlockArrayAction; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockArrayAction; }
}
