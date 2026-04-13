import { Filter } from './Filter.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';
import { Matrix4 } from '../Math/Matrix4.js';
import { XY } from '../Math/XY.js';

export class SpatialFilter extends Filter {
	static readonly SpatialFilterEntryName = 'SPATIAL';

	backDistance: number = 0;
	boundaryPoints: XY[] = [];
	clipBackPlane: boolean = false;
	clipFrontPlane: boolean = false;
	displayBoundary: boolean = false;
	frontDistance: number = 0;
	insertTransform: Matrix4 = Matrix4.identity(); // Matrix4
	inverseInsertTransform: Matrix4 = Matrix4.identity(); // Matrix4
	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string { return DxfFileToken.ObjectSpatialFilter; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }

	origin: XYZ = new XYZ(0, 0, 1);

	override get subclassMarker(): string { return DxfSubclassMarker.SpatialFilter; }

	constructor(name?: string) {
		super(name);
	}
}
