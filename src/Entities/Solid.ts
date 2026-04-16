import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';

export class Solid extends Entity {
	firstCorner: XYZ = new XYZ(0, 0, 0);

	fourthCorner: XYZ = new XYZ(0, 0, 0);

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.entitySolid;
	}

	override get objectType(): ObjectType {
		return ObjectType.SOLID;
	}

	secondCorner: XYZ = new XYZ(0, 0, 0);

	override get subclassMarker(): string {
		return DxfSubclassMarker.solid;
	}

	thickness: number = 0.0;

	thirdCorner: XYZ = new XYZ(0, 0, 0);

	override applyTransform(transform: unknown): void {
		this.firstCorner = this.applyTransformToPoint(transform, this.firstCorner);
		this.secondCorner = this.applyTransformToPoint(transform, this.secondCorner);
		this.thirdCorner = this.applyTransformToPoint(transform, this.thirdCorner);
		this.fourthCorner = this.applyTransformToPoint(transform, this.fourthCorner);
		this.normal = this.applyTransformToVector(transform, this.normal).normalize();
	}

	override getBoundingBox(): BoundingBox {
		return BoundingBox.fromPoints([
			this.firstCorner,
			this.secondCorner,
			this.thirdCorner,
			this.fourthCorner,
		]);
	}
}
