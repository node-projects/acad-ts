import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { OleObjectType } from './OleObjectType.js';
import { XYZ } from '../Math/XYZ.js';

export class Ole2Frame extends Entity {
	binaryData: Uint8Array = new Uint8Array(0);

	isPaperSpace: boolean = false;

	lowerRightCorner: XYZ = new XYZ(0, 0, 0);

	override get objectName(): string {
		return DxfFileToken.EntityOle2Frame;
	}

	override get objectType(): ObjectType {
		return ObjectType.OLE2FRAME;
	}

	oleObjectType: OleObjectType = OleObjectType.Embedded;

	sourceApplication: string = '';

	override get subclassMarker(): string {
		return DxfSubclassMarker.Ole2Frame;
	}

	upperLeftCorner: XYZ = new XYZ(1, 1, 0);

	version: number = 2;

	override applyTransform(transform: unknown): void {
		this.upperLeftCorner = this.applyTransformToPoint(transform, this.upperLeftCorner);
		this.lowerRightCorner = this.applyTransformToPoint(transform, this.lowerRightCorner);
	}

	override getBoundingBox(): BoundingBox {
		return BoundingBox.FromPoints([this.upperLeftCorner, this.lowerRightCorner]);
	}
}
