import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';

export class Line extends Entity {
	endPoint: XYZ = new XYZ(0, 0, 0);

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.EntityLine;
	}

	override get objectType(): ObjectType {
		return ObjectType.LINE;
	}

	startPoint: XYZ = new XYZ(0, 0, 0);

	override get subclassMarker(): string {
		return DxfSubclassMarker.Line;
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

	override applyTransform(transform: any): void {
		// TODO: transform.ApplyTransform not available
	}

	override getBoundingBox(): any {
		const min = new XYZ(
			Math.min(this.startPoint.x, this.endPoint.x),
			Math.min(this.startPoint.y, this.endPoint.y),
			Math.min(this.startPoint.z, this.endPoint.z),
		);
		const max = new XYZ(
			Math.max(this.startPoint.x, this.endPoint.x),
			Math.max(this.startPoint.y, this.endPoint.y),
			Math.max(this.startPoint.z, this.endPoint.z),
		);
		return { min, max };
	}
}
