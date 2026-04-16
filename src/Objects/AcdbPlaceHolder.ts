import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class AcdbPlaceHolder extends NonGraphicalObject {
	override get objectType(): ObjectType {
		return ObjectType.ACDBPLACEHOLDER;
	}

	override get objectName(): string {
		return DxfFileToken.objectPlaceholder;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.acDbPlaceHolder;
	}
}
