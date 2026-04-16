import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class DictionaryVariable extends NonGraphicalObject {
	static readonly currentAnnotationScale = 'CANNOSCALE';
	static readonly currentMultiLeaderStyle = 'CMLEADERSTYLE';
	static readonly currentTableStyle = 'CTABLESTYLE';
	static readonly wipeoutFrame = 'WIPEOUTFRAME';

	override get objectName(): string {
		return DxfFileToken.objectDictionaryVar;
	}

	objectSchemaNumber: number = 0;

	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.dictionaryVariables;
	}

	value: string = '';

	constructor(name?: string, value?: string) {
		super(name);
		if (value !== undefined) {
			this.value = value;
		}
	}
}
