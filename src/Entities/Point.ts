import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';

export class Point extends Entity {
	location: XYZ = new XYZ(0, 0, 0);

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.entityPoint;
	}

	override get objectType(): ObjectType {
		return ObjectType.POINT;
	}

	rotation: number = 0.0;

	override get subclassMarker(): string {
		return DxfSubclassMarker.point;
	}

	thickness: number = 0.0;

	constructor(location?: XYZ) {
		super();
		if (location) {
			this.location = location;
		}
	}

	override applyTransform(transform: unknown): void {
		this.location = this.applyTransformToPoint(transform, this.location);
		this.normal = this.applyTransformToVector(transform, this.normal).normalize();
	}

	override getBoundingBox(): BoundingBox {
		return BoundingBox.fromPoints([this.location]);
	}
}
