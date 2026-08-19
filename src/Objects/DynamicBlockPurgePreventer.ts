import { NonGraphicalObject } from './NonGraphicalObject.js';
import { BlockRecord } from '../Tables/BlockRecord.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class DynamicBlockPurgePreventer extends NonGraphicalObject {
	block: BlockRecord | null = null;
	/** @internal */ blockHandle: number = 0;
	version: number = 0;
	override get objectName(): string { return DxfFileToken.objectDynamicBlockPurgePreventer; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get subclassMarker(): string { return DxfSubclassMarker.dynamicBlockPurgePreventer; }
}
