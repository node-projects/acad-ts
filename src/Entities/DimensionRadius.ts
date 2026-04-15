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

export class DimensionRadius extends Dimension {
	angleVertex: XYZ = new XYZ(0, 0, 0);

	leaderLength: number = 0;

	get measurement(): number {
		return distanceFrom(this.definitionPoint, this.angleVertex);
	}

	override get objectName(): string {
		return DxfFileToken.EntityDimension;
	}

	override get objectType(): ObjectType {
		return ObjectType.DIMENSION_RADIUS;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.RadialDimension;
	}

	constructor() {
		super(DimensionType.Radius);
	}

	override applyTransform(transform: unknown): void {
		super.applyTransform(transform);
		this.angleVertex = this.applyTransformToPoint(transform, this.angleVertex);
	}

	override getBoundingBox(): BoundingBox {
		return BoundingBox.FromPoints([this.definitionPoint, this.angleVertex, this.insertionPoint, this.textMiddlePoint]);
	}

	override updateBlock(): void {
		this.populateBlock(
			[[this.angleVertex, this.definitionPoint]],
			[this.angleVertex, this.definitionPoint, this.insertionPoint, this.textMiddlePoint],
		);
	}
}
