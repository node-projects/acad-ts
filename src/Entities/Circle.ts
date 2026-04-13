import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';

export class Circle extends Entity {
	center: XYZ = new XYZ(0, 0, 0);

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.EntityCircle;
	}

	override get objectType(): ObjectType {
		return ObjectType.CIRCLE;
	}

	get radius(): number {
		return this._radius;
	}
	set radius(value: number) {
		if (value <= 0) {
			throw new Error('The radius must be greater than 0.');
		}
		this._radius = value;
	}

	get radiusRatio(): number {
		return 1;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.Circle;
	}

	thickness: number = 0.0;

	private _radius: number = 1.0;

	constructor() {
		super();
	}

	override applyTransform(transform: any): void {
		// TODO: Transform operations not available
	}

	override getBoundingBox(): any {
		const min: XYZ = new XYZ(this.center.x - this._radius, this.center.y - this._radius, this.center.z,);
		const max: XYZ = new XYZ(this.center.x + this._radius, this.center.y + this._radius, this.center.z,);
		return { min, max };
	}

	polarCoordinateRelativeToCenter(angle: number): XYZ {
		// TODO: CurveExtensions.PolarCoordinate not available
		return new XYZ(0, 0, 0);
	}

	polygonalVertexes(precision: number): XYZ[] {
		if (precision < 2) {
			throw new Error('The arc precision must be equal or greater than two.');
		}
		// TODO: CurveExtensions.PolygonalVertexes not available
		return [];
	}
}
