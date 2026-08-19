import { StretchActionBase } from './StretchActionBase.js';
import { EvalConnection } from './EvalConnection.js';
import { Entity } from '../../Entities/Entity.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockPolarStretchAction extends StretchActionBase {
	baseConnection: EvalConnection = new EvalConnection();
	baseXDeltaConnection: EvalConnection = new EvalConnection();
	baseYDeltaConnection: EvalConnection = new EvalConnection();
	endConnection: EvalConnection = new EvalConnection();
	rotateBindings: Entity[] = [];
	updatedBaseConnection: EvalConnection = new EvalConnection();
	updatedEndConnection: EvalConnection = new EvalConnection();
	override get objectName(): string { return DxfFileToken.objectBlockPolarStretchAction; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockPolarStretchAction; }
}
