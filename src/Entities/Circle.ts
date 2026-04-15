import { Entity } from './Entity.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { Transform } from '../Math/Transform.js';
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

	override applyTransform(transform: unknown): void {
		if (!(transform instanceof Transform)) {
			return;
		}

		this.center = this.applyTransformToPoint(transform, this.center);
		this.normal = this.applyTransformToVector(transform, this.normal).normalize();

		const scale = this.getTransformAxisScale(transform);
		this.radius *= (scale.x + scale.y) / 2;
	}

	override getBoundingBox(): BoundingBox {
		const min: XYZ = new XYZ(this.center.x - this._radius, this.center.y - this._radius, this.center.z,);
		const max: XYZ = new XYZ(this.center.x + this._radius, this.center.y + this._radius, this.center.z,);
		return new BoundingBox(min, max);
	}

	polarCoordinateRelativeToCenter(angle: number): XYZ {
		return new XYZ(
			this.center.x + this._radius * Math.cos(angle),
			this.center.y + this._radius * Math.sin(angle),
			this.center.z,
		);
	}

	polygonalVertexes(precision: number): XYZ[] {
		if (precision < 2) {
			throw new Error('The arc precision must be equal or greater than two.');
		}

		const vertexes: XYZ[] = [];
		const step = (Math.PI * 2) / precision;
		for (let index = 0; index < precision; index++) {
			vertexes.push(this.polarCoordinateRelativeToCenter(step * index));
		}
		return vertexes;
	}
}
