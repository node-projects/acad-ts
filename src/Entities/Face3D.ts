import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { InvisibleEdgeFlags } from './InvisibleEdgeFlags.js';
import { XYZ } from '../Math/XYZ.js';

export class Face3D extends Entity {
	override get objectType(): ObjectType {
		return ObjectType.FACE3D;
	}

	override get objectName(): string {
		return DxfFileToken.entity3DFace;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.face3d;
	}

	firstCorner: XYZ = new XYZ(0, 0, 0);

	secondCorner: XYZ = new XYZ(0, 0, 0);

	thirdCorner: XYZ = new XYZ(0, 0, 0);

	fourthCorner: XYZ = new XYZ(0, 0, 0);

	flags: InvisibleEdgeFlags = InvisibleEdgeFlags.None;

	constructor() {
		super();
	}

	override getBoundingBox(): BoundingBox {
		return BoundingBox.fromPoints([
			this.firstCorner,
			this.secondCorner,
			this.thirdCorner,
			this.fourthCorner,
		]);
	}

	override applyTransform(transform: unknown): void {
		this.firstCorner = this.applyTransformToPoint(transform, this.firstCorner);
		this.secondCorner = this.applyTransformToPoint(transform, this.secondCorner);
		this.thirdCorner = this.applyTransformToPoint(transform, this.thirdCorner);
		this.fourthCorner = this.applyTransformToPoint(transform, this.fourthCorner);
	}
}

export { InvisibleEdgeFlags } from './InvisibleEdgeFlags.js';
