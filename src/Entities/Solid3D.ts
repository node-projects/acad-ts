import { ModelerGeometry } from './ModelerGeometry.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class Solid3D extends ModelerGeometry {
	override get objectType(): ObjectType {
		return ObjectType.SOLID3D;
	}

	override get objectName(): string {
		return DxfFileToken.Entity3DSolid;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.Solid3D;
	}
}
