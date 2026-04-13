import { Dimension } from './Dimension.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DimensionType } from './DimensionType.js';
import { XYZ } from '../Math/XYZ.js';

export class DimensionAngular3Pt extends Dimension {
	angleVertex: XYZ = new XYZ(0, 0, 0);

	firstPoint: XYZ = new XYZ(0, 0, 0);

	get measurement(): number {
		// TODO: AngleBetweenVectors / IsParallel not available
		return 0;
	}

	override get objectName(): string {
		return DxfFileToken.EntityDimension;
	}

	override get objectType(): ObjectType {
		return ObjectType.DIMENSION_ANG_3_Pt;
	}

	secondPoint: XYZ = new XYZ(0, 0, 0);

	override get subclassMarker(): string {
		return DxfSubclassMarker.Angular3PointDimension;
	}

	constructor() {
		super(DimensionType.Angular3Point);
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
		super.updateBlock();
	}
}
