import { BlockAction } from './BlockAction.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { EvalConnection } from './EvalConnection.js';

export class BlockFlipAction extends BlockAction {
	flipConnection: EvalConnection = new EvalConnection();
	updatedFlipConnection: EvalConnection = new EvalConnection();
	updatedBaseConnection: EvalConnection = new EvalConnection();
	updatedEndConnection: EvalConnection = new EvalConnection();
	caption301: string = '';
	caption302: string = '';
	caption303: string = '';
	caption304: string = '';

	override get objectName(): string { return DxfFileToken.objectBlockFlipAction; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockFlipAction; }

	value92: number = 0;
	value93: number = 0;
	value94: number = 0;
	value95: number = 0;
}
