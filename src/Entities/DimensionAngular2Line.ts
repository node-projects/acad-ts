import { Dimension } from './Dimension.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DimensionType } from './DimensionType.js';
import { XYZ } from '../Math/XYZ.js';

export class DimensionAngular2Line extends Dimension {
	angleVertex: XYZ = new XYZ(0, 0, 0);

	get center(): XYZ {
		// TODO: Line3D intersection not available
		return new XYZ(0, 0, 0);
	}

	dimensionArc: XYZ = new XYZ(0, 0, 0);

	firstPoint: XYZ = new XYZ(0, 0, 0);

	get measurement(): number {
		// TODO: AngleBetweenVectors not available
		return 0;
	}

	override get objectName(): string {
		return DxfFileToken.EntityDimension;
	}

	override get objectType(): ObjectType {
		return ObjectType.DIMENSION_ANG_2_Ln;
	}

	get offset(): number {
		const dx = this.secondPoint.x - this.definitionPoint.x;
		const dy = this.secondPoint.y - this.definitionPoint.y;
		const dz = this.secondPoint.z - this.definitionPoint.z;
		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	}
	set offset(value: number) {
		// TODO: Cross product not available
	}

	secondPoint: XYZ = new XYZ(0, 0, 0);

	override get subclassMarker(): string {
		return DxfSubclassMarker.Angular2LineDimension;
	}

	constructor() {
		super(DimensionType.Angular);
	}

	override applyTransform(transform: any): void {
		super.applyTransform(transform);
		// TODO: Transform points
	}

	override getBoundingBox(): any {
		return {
			min: {
				x: Math.min(this.firstPoint.x, this.secondPoint.x),
				y: Math.min(this.firstPoint.y, this.secondPoint.y),
				z: Math.min(this.firstPoint.z, this.secondPoint.z),
			},
			max: {
				x: Math.max(this.firstPoint.x, this.secondPoint.x),
				y: Math.max(this.firstPoint.y, this.secondPoint.y),
				z: Math.max(this.firstPoint.z, this.secondPoint.z),
			},
		};
	}

	override updateBlock(): void {
		// Not yet implemented in C# source
		return;
	}
}
