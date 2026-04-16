import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { ResolutionUnit } from './ResolutionUnit.js';
import { XY } from '../Math/XY.js';

export class ImageDefinition extends NonGraphicalObject {
	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	override get objectName(): string {
		return DxfFileToken.objectImageDefinition;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.rasterImageDef;
	}

	classVersion: number = 0;
	fileName: string = '';
	size: XY = new XY(0, 0);
	defaultSize: XY = new XY(1, 1);
	isLoaded: boolean = true;
	units: ResolutionUnit = ResolutionUnit.None;
}

export { ResolutionUnit } from './ResolutionUnit.js';
