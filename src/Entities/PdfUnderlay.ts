import { UnderlayEntity } from './UnderlayEntity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class PdfUnderlay extends UnderlayEntity {
	override get objectName(): string {
		return DxfFileToken.EntityPdfUnderlay;
	}

	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	constructor(definition?: any /* PdfUnderlayDefinition */) {
		super(definition);
	}
}
