import { AttributeBase } from './AttributeBase.js';
import type { AttributeDefinition } from './AttributeDefinition.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class AttributeEntity extends AttributeBase {
	override get objectName(): string {
		return DxfFileToken.entityAttribute;
	}

	override get objectType(): ObjectType {
		return ObjectType.ATTRIB;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.attribute;
	}

	constructor(definition?: AttributeDefinition) {
		super();
		if (definition) {
			this.matchAttributeProperties(definition);
		}
	}
}
