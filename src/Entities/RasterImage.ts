import { CadWipeoutBase } from './CadWipeoutBase.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class RasterImage extends CadWipeoutBase {
	override get objectName(): string {
		return DxfFileToken.EntityImage;
	}

	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.RasterImage;
	}

	override get definition(): any /* ImageDefinition */ {
		return super.definition;
	}
	override set definition(value: any /* ImageDefinition */) {
		if (value == null) {
			throw new Error('value cannot be null');
		}
		super.definition = value;
	}

	constructor(imageDefinition?: any /* ImageDefinition */) {
		super();
		if (imageDefinition) {
			this.definition = imageDefinition;
		}
	}
}
