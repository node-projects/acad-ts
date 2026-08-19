import { Dimension } from './Dimension.js';
import { DimensionType } from './DimensionType.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
import { ObjectType } from '../Types/ObjectType.js';

export class DimensionArc extends Dimension {
	center: XYZ = new XYZ(0, 0, 0);
	endAngle: number = 0;
	firstPoint: XYZ = new XYZ(0, 0, 0);
	hasLeader: boolean = false;
	isPartial: boolean = false;
	leaderPoint1: XYZ = new XYZ(0, 0, 0);
	leaderPoint2: XYZ = new XYZ(0, 0, 0);
	secondPoint: XYZ = new XYZ(0, 0, 0);
	startAngle: number = 0;

	override get measurement(): number {
		const first = Dimension.subtractPoints(this.firstPoint, this.center);
		const second = Dimension.subtractPoints(this.secondPoint, this.center);
		const radius = Math.sqrt(first.dot(first));
		if (first.equals(second)) return 0;
		const angle = Dimension.areParallel(first, second) ? Math.PI : Dimension.angleBetweenVectors(first, second);
		return radius * angle;
	}

	override get objectName(): string { return DxfFileToken.entityArcDimension; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get subclassMarker(): string { return DxfSubclassMarker.arcDimension; }

	constructor() {
		super(DimensionType.Angular3Point);
	}

	override applyTransform(transform: unknown): void {
		super.applyTransform(transform);
		this.firstPoint = this.applyTransformToPoint(transform, this.firstPoint);
		this.secondPoint = this.applyTransformToPoint(transform, this.secondPoint);
		this.center = this.applyTransformToPoint(transform, this.center);
		this.leaderPoint1 = this.applyTransformToPoint(transform, this.leaderPoint1);
		this.leaderPoint2 = this.applyTransformToPoint(transform, this.leaderPoint2);
	}

	override getBoundingBox(): BoundingBox {
		return BoundingBox.fromPoints([this.firstPoint, this.secondPoint]);
	}
}
