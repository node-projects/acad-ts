import { Dimension } from './Dimension.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DimensionType } from './DimensionType.js';
import { XYZ } from '../Math/XYZ.js';

export class DimensionAngular2Line extends Dimension {
	angleVertex: XYZ = new XYZ(0, 0, 0);

	get center(): XYZ {
		return Dimension.intersectLinesXY(this.definitionPoint, this.angleVertex, this.firstPoint, this.secondPoint);
	}

	dimensionArc: XYZ = new XYZ(0, 0, 0);

	firstPoint: XYZ = new XYZ(0, 0, 0);

	get measurement(): number {
		const firstVector = Dimension.subtractPoints(this.secondPoint, this.firstPoint);
		const secondVector = Dimension.subtractPoints(this.definitionPoint, this.angleVertex);
		let angle = Dimension.angleBetweenVectors(firstVector, secondVector);

		const center = this.center;
		if (!Number.isFinite(center.x) || !Number.isFinite(center.y) || !Number.isFinite(center.z)) {
			return angle;
		}

		const arcVector = Dimension.subtractPoints(this.dimensionArc, center);
		if (Dimension.isZeroVector(arcVector)) {
			return angle;
		}

		const dot1 = firstVector.cross(arcVector).dot(this.normal);
		const dot2 = arcVector.cross(secondVector).dot(this.normal);
		const isInOppositeSector = (dot1 < 0 && dot2 > 0) || (dot1 > 0 && dot2 < 0);
		if (isInOppositeSector) {
			angle = Math.PI - angle;
		}

		return angle;
	}

	override get objectName(): string {
		return DxfFileToken.entityDimension;
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
		return DxfSubclassMarker.angular2LineDimension;
	}

	constructor() {
		super(DimensionType.Angular);
	}

	override applyTransform(transform: unknown): void {
		super.applyTransform(transform);
		this.angleVertex = this.applyTransformToPoint(transform, this.angleVertex);
		this.dimensionArc = this.applyTransformToPoint(transform, this.dimensionArc);
		this.firstPoint = this.applyTransformToPoint(transform, this.firstPoint);
		this.secondPoint = this.applyTransformToPoint(transform, this.secondPoint);
	}

	override getBoundingBox(): BoundingBox {
		return BoundingBox.fromPoints([this.angleVertex, this.dimensionArc, this.firstPoint, this.secondPoint, this.definitionPoint]);
	}

	override updateBlock(): void {
		// Not yet implemented in C# source
		return;
	}
}
