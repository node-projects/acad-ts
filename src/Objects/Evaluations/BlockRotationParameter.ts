import { Block2PtParameter } from './Block2PtParameter.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { XYZ } from '../../Math/XYZ.js';

export class BlockRotationParameter extends Block2PtParameter {
	description: string = '';
	name: string = '';
	nameOffset: number = 0;

	override get objectName(): string { return DxfFileToken.ObjectBlockRotationParameter; }

	point: XYZ = new XYZ(0, 0, 0);

	override get subclassMarker(): string { return DxfSubclassMarker.BlockRotationParameter; }

	value141: number = 0;
	value142: number = 0;
	value143: number = 0;
	value175: number = 0;
	value307: string = '';
	value96: number = 0;
}
