import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { InvisibleEdgeFlags } from './InvisibleEdgeFlags.js';
import { XYZ } from '../Math/XYZ.js';

export class Face3D extends Entity {
	override get objectType(): ObjectType {
		return ObjectType.FACE3D;
	}

	override get objectName(): string {
		return DxfFileToken.Entity3DFace;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.Face3d;
	}

	firstCorner: XYZ = new XYZ(0, 0, 0);

	secondCorner: XYZ = new XYZ(0, 0, 0);

	thirdCorner: XYZ = new XYZ(0, 0, 0);

	fourthCorner: XYZ = new XYZ(0, 0, 0);

	flags: InvisibleEdgeFlags = InvisibleEdgeFlags.None;

	constructor() {
		super();
	}

	override getBoundingBox(): any {
		// TODO: BoundingBox.FromPoints not available
		return null;
	}

	override applyTransform(transform: any): void {
		// TODO: transform.ApplyTransform not available
	}
}

export { InvisibleEdgeFlags } from './InvisibleEdgeFlags.js';
