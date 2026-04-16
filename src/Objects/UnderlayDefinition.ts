import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export abstract class UnderlayDefinition extends NonGraphicalObject {
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get subclassMarker(): string { return DxfSubclassMarker.underlayDefinition; }

	file: string = '';
}
