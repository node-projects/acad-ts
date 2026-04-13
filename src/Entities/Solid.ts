import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';

export class Solid extends Entity {
	firstCorner: XYZ = new XYZ(0, 0, 0);

	fourthCorner: XYZ = new XYZ(0, 0, 0);

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.EntitySolid;
	}

	override get objectType(): ObjectType {
		return ObjectType.SOLID;
	}

	secondCorner: XYZ = new XYZ(0, 0, 0);

	override get subclassMarker(): string {
		return DxfSubclassMarker.Solid;
	}

	thickness: number = 0.0;

	thirdCorner: XYZ = new XYZ(0, 0, 0);

	override applyTransform(transform: any): void {
		// TODO: transform.ApplyTransform not available
	}

	override getBoundingBox(): any {
		// TODO: BoundingBox.FromPoints not available
		return null;
	}
}
