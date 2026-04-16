import { AttributeBase } from './AttributeBase.js';
import type { AttributeEntity } from './AttributeEntity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class AttributeDefinition extends AttributeBase {
	override get objectType(): ObjectType {
		return ObjectType.ATTDEF;
	}

	override get objectName(): string {
		return DxfFileToken.entityAttributeDefinition;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.attributeDefinition;
	}

	prompt: string = '';

	constructor(entity?: AttributeEntity) {
		super();
		if (entity) {
			this.matchAttributeProperties(entity);
		}
	}
}
