import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
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

	override applyTransform(transform: unknown): void {
		this.startPoint = this.applyTransformToPoint(transform, this.startPoint);
		const direction = this.applyTransformToVector(transform, this.direction);
		if (direction.getLength() > 0) {
			this.direction = direction.normalize();
		}
	}

	override getBoundingBox(): BoundingBox {
		return BoundingBox.Infinite;
	}
}
