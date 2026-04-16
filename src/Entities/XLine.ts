import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';

export class XLine extends Entity {
	direction: XYZ = new XYZ(0, 0, 0);

	firstPoint: XYZ = new XYZ(0, 0, 0);

	override get objectName(): string {
		return DxfFileToken.entityXline;
	}

	override get objectType(): ObjectType {
		return ObjectType.XLINE;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.xLine;
	}

	override applyTransform(transform: unknown): void {
		this.firstPoint = this.applyTransformToPoint(transform, this.firstPoint);
		const direction = this.applyTransformToVector(transform, this.direction);
		if (direction.getLength() > 0) {
			this.direction = direction.normalize();
		}
	}

	override getBoundingBox(): BoundingBox {
		return BoundingBox.infinite;
	}
}
