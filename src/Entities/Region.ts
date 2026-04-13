import { ModelerGeometry } from './ModelerGeometry.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { ObjectType } from '../Types/ObjectType.js';

export class Region extends ModelerGeometry {
	override get objectType(): ObjectType {
		return ObjectType.REGION;
	}

	override get objectName(): string {
		return DxfFileToken.EntityRegion;
	}
}
