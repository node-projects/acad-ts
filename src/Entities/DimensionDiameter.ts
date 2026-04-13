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

function mid(a: XYZ, b: XYZ): XYZ {
	return new XYZ((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2,);
}

export class DimensionDiameter extends Dimension {
	angleVertex: XYZ = new XYZ(0, 0, 0);

	get center(): XYZ {
		return mid(this.angleVertex, this.definitionPoint);
	}

	leaderLength: number = 0;

	get measurement(): number {
		return distanceFrom(this.definitionPoint, this.angleVertex);
	}

	override get objectName(): string {
		return DxfFileToken.EntityDimension;
	}

	override get objectType(): ObjectType {
		return ObjectType.DIMENSION_DIAMETER;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.DiametricDimension;
	}

	constructor() {
		super(DimensionType.Diameter);
	}

	override applyTransform(transform: any): void {
		super.applyTransform(transform);
		// TODO: Transform AngleVertex
	}

	override getBoundingBox(): any {
		return {
			min: new XYZ(this.insertionPoint.x - this.angleVertex.x, this.insertionPoint.y - this.angleVertex.y, this.insertionPoint.z - this.angleVertex.z,),
			max: new XYZ(this.insertionPoint.x + this.angleVertex.x, this.insertionPoint.y + this.angleVertex.y, this.insertionPoint.z + this.angleVertex.z,),
		};
	}

	override updateBlock(): void {
		super.updateBlock();
		// TODO: Complex block generation
	}
}
