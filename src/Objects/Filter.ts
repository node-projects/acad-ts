import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export abstract class Filter extends NonGraphicalObject {
	static readonly FilterEntryName = 'ACAD_FILTER';

	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.Filter;
	}

	constructor(name?: string) {
		super(name);
	}
}
