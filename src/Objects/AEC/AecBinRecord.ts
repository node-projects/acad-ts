import { NonGraphicalObject } from '../NonGraphicalObject.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { ObjectType } from '../../Types/ObjectType.js';

export class AecBinRecord extends NonGraphicalObject {
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get objectName(): string { return DxfFileToken.ObjectBinRecord; }
	override get subclassMarker(): string { return DxfSubclassMarker.BinRecord; }

	version: number = 0;
	binaryData: Uint8Array = new Uint8Array(0);
}
