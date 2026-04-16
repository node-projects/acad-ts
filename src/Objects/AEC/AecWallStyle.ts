import { NonGraphicalObject } from '../NonGraphicalObject.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { ObjectType } from '../../Types/ObjectType.js';

export class AecWallStyle extends NonGraphicalObject {
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get objectName(): string { return DxfFileToken.objectAecWallStyle; }
	override get subclassMarker(): string { return DxfSubclassMarker.aecDbWallStyle; }

	version: number = 0;
	description: string = '';
	rawData: Uint8Array | null = null;

	constructor(name?: string) {
		super(name);
	}
}
