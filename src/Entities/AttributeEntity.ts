import { AttributeBase } from './AttributeBase.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class AttributeEntity extends AttributeBase {
	override get objectName(): string {
		return DxfFileToken.EntityAttribute;
	}

	override get objectType(): ObjectType {
		return ObjectType.ATTRIB;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.Attribute;
	}

	constructor(definition?: any /* AttributeDefinition */) {
		super();
		if (definition) {
			this.matchAttributeProperties(definition);
		}
	}
}
