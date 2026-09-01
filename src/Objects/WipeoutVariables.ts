import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { NonGraphicalObject } from './NonGraphicalObject.js';

export class WipeoutVariables extends NonGraphicalObject {
	displayImageFrame: boolean = false;

	override get objectName(): string { return DxfFileToken.objectWipeoutVariables; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get subclassMarker(): string { return DxfSubclassMarker.wipeoutVariables; }
}
