import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';

export abstract class ObjectContextData extends NonGraphicalObject {
	override get subclassMarker(): string {
		return DxfSubclassMarker.objectContextData;
	}

	version: number = 3;
	hasFileToExtensionDictionary: boolean = true;
	default: boolean = false;
}
