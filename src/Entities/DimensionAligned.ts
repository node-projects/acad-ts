import { Dimension } from './Dimension.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
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
		return DxfFileToken.entityDimension;
	}

	override get objectType(): ObjectType {
		return ObjectType.DIMENSION_ALIGNED;
	}

	get offset(): number {
		return distanceFrom(this.secondPoint, this.definitionPoint);
	}
	set offset(value: number) {
		const direction = Dimension.subtractPoints(this.secondPoint, this.firstPoint);
		const perpendicular = this.normal.cross(direction).normalize();
		this.definitionPoint = new XYZ(
			this.secondPoint.x + perpendicular.x * value,
			this.secondPoint.y + perpendicular.y * value,
			this.secondPoint.z + perpendicular.z * value,
		);
	}

	secondPoint: XYZ = new XYZ(0, 0, 0);

	override get subclassMarker(): string {
		return DxfSubclassMarker.alignedDimension;
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

	override applyTransform(transform: unknown): void {
		super.applyTransform(transform);
		this.firstPoint = this.applyTransformToPoint(transform, this.firstPoint);
		this.secondPoint = this.applyTransformToPoint(transform, this.secondPoint);
	}

	override getBoundingBox(): BoundingBox {
		return BoundingBox.fromPoints([this.firstPoint, this.secondPoint, this.definitionPoint]);
	}

	override updateBlock(): void {
		this.populateBlock(
			[[this.firstPoint, this.secondPoint]],
			[this.firstPoint, this.secondPoint, this.definitionPoint],
		);
	}
}
