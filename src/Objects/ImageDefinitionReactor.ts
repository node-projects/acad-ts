import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class ImageDefinitionReactor extends NonGraphicalObject {
	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	override get objectName(): string {
		return DxfFileToken.ObjectImageDefinitionReactor;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.RasterImageDefReactor;
	}

	classVersion: number = 2;
	image: any = null;
}
