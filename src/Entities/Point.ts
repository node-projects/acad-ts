import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';

export class Point extends Entity {
	location: XYZ = new XYZ(0, 0, 0);

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.EntityPoint;
	}

	override get objectType(): ObjectType {
		return ObjectType.POINT;
	}

	rotation: number = 0.0;

	override get subclassMarker(): string {
		return DxfSubclassMarker.Point;
	}

	thickness: number = 0.0;

	constructor(location?: XYZ) {
		super();
		if (location) {
			this.location = location;
		}
	}

	override applyTransform(transform: any): void {
		// TODO: transform.ApplyTransform not available
	}

	override getBoundingBox(): any {
		// TODO: BoundingBox not available
		return null;
	}
}
