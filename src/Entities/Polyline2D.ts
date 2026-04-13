import { Polyline } from './Polyline.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class Polyline2D extends Polyline {
	override get objectName(): string {
		return DxfFileToken.EntityPolyline;
	}

	override get objectType(): ObjectType {
		return ObjectType.POLYLINE_2D;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.Polyline;
	}

  getBoundingBox(): any { return null; }
}
