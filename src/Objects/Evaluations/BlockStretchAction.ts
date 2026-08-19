import { StretchActionBase } from './StretchActionBase.js';
import { EvalConnection } from './EvalConnection.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockStretchAction extends StretchActionBase {
	endXDeltaConnection: EvalConnection = new EvalConnection();
	endYDeltaConnection: EvalConnection = new EvalConnection();
	unknownFlag: number = 0;
	override get objectName(): string { return DxfFileToken.objectBlockStretchAction; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockStretchAction; }
}
