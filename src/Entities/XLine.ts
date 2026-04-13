import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';

export class XLine extends Entity {
	direction: XYZ = new XYZ(0, 0, 0);

	firstPoint: XYZ = new XYZ(0, 0, 0);

	override get objectName(): string {
		return DxfFileToken.EntityXline;
	}

	override get objectType(): ObjectType {
		return ObjectType.XLINE;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.XLine;
	}

	override applyTransform(transform: any): void {
		// TODO: transform.ApplyTransform/ApplyRotation not available
	}

	override getBoundingBox(): any {
		// BoundingBox.Infinite
		return null;
	}
}
