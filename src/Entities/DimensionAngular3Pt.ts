import { Dimension } from './Dimension.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DimensionType } from './DimensionType.js';
import { XYZ } from '../Math/XYZ.js';

export class DimensionAngular3Pt extends Dimension {
	angleVertex: XYZ = new XYZ(0, 0, 0);

	firstPoint: XYZ = new XYZ(0, 0, 0);

	get measurement(): number {
		const firstVector = Dimension.subtractPoints(this.firstPoint, this.angleVertex);
		const secondVector = Dimension.subtractPoints(this.secondPoint, this.angleVertex);

		if (firstVector.equals(secondVector)) {
			return 0;
		}

		if (Dimension.areParallel(firstVector, secondVector)) {
			return Math.PI;
		}

		return Dimension.angleBetweenVectors(firstVector, secondVector);
	}

	override get objectName(): string {
		return DxfFileToken.entityDimension;
	}

	override get objectType(): ObjectType {
		return ObjectType.DIMENSION_ANG_3_Pt;
	}

	secondPoint: XYZ = new XYZ(0, 0, 0);

	override get subclassMarker(): string {
		return DxfSubclassMarker.angular3PointDimension;
	}

	constructor() {
		super(DimensionType.Angular3Point);
	}

	override applyTransform(transform: unknown): void {
		super.applyTransform(transform);
		this.angleVertex = this.applyTransformToPoint(transform, this.angleVertex);
		this.firstPoint = this.applyTransformToPoint(transform, this.firstPoint);
		this.secondPoint = this.applyTransformToPoint(transform, this.secondPoint);
	}

	override getBoundingBox(): BoundingBox {
		return BoundingBox.fromPoints([this.angleVertex, this.firstPoint, this.secondPoint, this.definitionPoint]);
	}

	override updateBlock(): void {
		super.updateBlock();
	}
}
