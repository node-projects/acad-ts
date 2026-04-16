import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import type { RasterImage } from '../Entities/RasterImage.js';

export class ImageDefinitionReactor extends NonGraphicalObject {
	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	override get objectName(): string {
		return DxfFileToken.objectImageDefinitionReactor;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.rasterImageDefReactor;
	}

	classVersion: number = 2;
	image: RasterImage | null = null;
}
