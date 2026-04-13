import { Dimension } from './Dimension.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DimensionType } from './DimensionType.js';
import { XYZ } from '../Math/XYZ.js';

function distanceFrom(a: XYZ, b: XYZ): number {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	const dz = a.z - b.z;
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export class DimensionAligned extends Dimension {
	extLineRotation: number = 0;

	firstPoint: XYZ = new XYZ(0, 0, 0);

	get measurement(): number {
		return distanceFrom(this.firstPoint, this.secondPoint);
	}

	override get objectName(): string {
		return DxfFileToken.EntityDimension;
	}

	override get objectType(): ObjectType {
		return ObjectType.DIMENSION_ALIGNED;
	}

	get offset(): number {
		return distanceFrom(this.secondPoint, this.definitionPoint);
	}
	set offset(value: number) {
		// TODO: XYZ.Cross not available for perpendicular calculation
	}

	secondPoint: XYZ = new XYZ(0, 0, 0);

	override get subclassMarker(): string {
		return DxfSubclassMarker.AlignedDimension;
	}

	constructor(firstPoint?: XYZ, secondPoint?: XYZ) {
		super(DimensionType.Aligned);
		if (firstPoint) {
			this.firstPoint = firstPoint;
		}
		if (secondPoint) {
			this.secondPoint = secondPoint;
		}
	}

	/** @internal */
	protected static createWithType(type: DimensionType): DimensionAligned {
		const d = new DimensionAligned();
		d._flags = type;
		d.definitionPoint = d.secondPoint;
		return d;
	}

	override applyTransform(transform: any): void {
		super.applyTransform(transform);
		// TODO: Transform FirstPoint and SecondPoint
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
		// TODO: Complex block generation
	}
}
