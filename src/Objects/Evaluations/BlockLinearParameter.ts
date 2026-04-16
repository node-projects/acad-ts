import { Block2PtParameter } from './Block2PtParameter.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { ObjectType } from '../../Types/ObjectType.js';

export class BlockLinearParameter extends Block2PtParameter {
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get objectName(): string { return DxfFileToken.objectBlockLinearParameter; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockLinearParameter; }

	label: string = '';
	description: string = '';
	labelOffset: number = 0;
}
