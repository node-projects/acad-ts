import { Entity } from './Entity.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';

export class Line extends Entity {
	endPoint: XYZ = new XYZ(0, 0, 0);

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.entityLine;
	}

	override get objectType(): ObjectType {
		return ObjectType.LINE;
	}

	startPoint: XYZ = new XYZ(0, 0, 0);

	override get subclassMarker(): string {
		return DxfSubclassMarker.line;
	}

	thickness: number = 0.0;

	constructor(start?: XYZ, end?: XYZ) {
		super();
		if (start) {
			this.startPoint = start;
		}
		if (end) {
			this.endPoint = end;
		}
	}

	override applyTransform(transform: unknown): void {
		this.startPoint = this.applyTransformToPoint(transform, this.startPoint);
		this.endPoint = this.applyTransformToPoint(transform, this.endPoint);
		this.normal = this.applyTransformToVector(transform, this.normal).normalize();
	}

	override getBoundingBox(): BoundingBox {
		return BoundingBox.fromPoints([this.startPoint, this.endPoint]);
	}
}
