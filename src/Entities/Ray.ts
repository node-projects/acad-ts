import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';

export class Ray extends Entity {
	direction: XYZ = new XYZ(0, 0, 0);

	override get objectName(): string {
		return DxfFileToken.EntityRay;
	}

	override get objectType(): ObjectType {
		return ObjectType.RAY;
	}

	startPoint: XYZ = new XYZ(0, 0, 0);

	override get subclassMarker(): string {
		return DxfSubclassMarker.Ray;
	}

	override applyTransform(transform: any): void {
		// TODO: transform.ApplyTransform/ApplyRotation not available
	}

	override getBoundingBox(): any {
		// BoundingBox.Infinite
		return null;
	}
}
