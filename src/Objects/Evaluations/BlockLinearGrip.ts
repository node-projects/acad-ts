import { BlockGrip } from './BlockGrip.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockLinearGrip extends BlockGrip {
	distanceX: number = 0;
	distanceY: number = 0;
	distanceZ: number = 0;
	override get objectName(): string { return DxfFileToken.objectBlockLinearGrip; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockLinearGrip; }
}
