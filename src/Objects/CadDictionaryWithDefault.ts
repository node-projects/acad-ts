import { CadDictionary } from './CadDictionary.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class CadDictionaryWithDefault extends CadDictionary {
	defaultEntry: CadObject | null = null;

	override get objectName(): string {
		return DxfFileToken.ObjectDictionaryWithDefault;
	}

	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.DictionaryWithDefault;
	}

	constructor(name?: string, defaultEntry?: CadObject) {
		super(name);
		if (defaultEntry) {
			this.defaultEntry = defaultEntry;
		}
	}
}
