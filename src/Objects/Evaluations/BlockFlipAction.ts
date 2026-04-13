import { BlockAction } from './BlockAction.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockFlipAction extends BlockAction {
	caption301: string = '';
	caption302: string = '';
	caption303: string = '';
	caption304: string = '';

	override get objectName(): string { return DxfFileToken.ObjectBlockFlipAction; }
	override get subclassMarker(): string { return DxfSubclassMarker.BlockFlipAction; }

	value92: number = 0;
	value93: number = 0;
	value94: number = 0;
	value95: number = 0;
}
