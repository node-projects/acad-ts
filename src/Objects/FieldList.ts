import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { Field } from './Field.js';

export class FieldList extends NonGraphicalObject {
	fields: Field[] = [];

	override get objectName(): string {
		return DxfFileToken.ObjectFieldList;
	}

	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.FieldList;
	}

	override clone(): CadObject {
		const clone = super.clone() as FieldList;
		clone.fields = [...this.fields];
		return clone;
	}
}
