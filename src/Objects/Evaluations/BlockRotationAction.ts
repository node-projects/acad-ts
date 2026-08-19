import { BlockActionBasePt } from './BlockActionBasePt.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { EvalConnection } from './EvalConnection.js';

export class BlockRotationAction extends BlockActionBasePt {
	angleDeltaConnection: EvalConnection = new EvalConnection();
	override get objectName(): string { return DxfFileToken.objectBlockRotateAction; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockRotationAction; }

	value303: string = '';
	value94: number = 0;
}
