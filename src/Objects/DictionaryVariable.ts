import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class DictionaryVariable extends NonGraphicalObject {
	static readonly CurrentAnnotationScale = 'CANNOSCALE';
	static readonly CurrentMultiLeaderStyle = 'CMLEADERSTYLE';
	static readonly CurrentTableStyle = 'CTABLESTYLE';
	static readonly WipeoutFrame = 'WIPEOUTFRAME';

	override get objectName(): string {
		return DxfFileToken.ObjectDictionaryVar;
	}

	objectSchemaNumber: number = 0;

	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.DictionaryVariables;
	}

	value: string = '';

	constructor(name?: string, value?: string) {
		super(name);
		if (value !== undefined) {
			this.value = value;
		}
	}
}
