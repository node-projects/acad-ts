import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { Transform } from '../Math/Transform.js';
import { XY } from '../Math/XY.js';
import { TextStyle } from '../Tables/TextStyle.js';
import { XYZ } from '../Math/XYZ.js';

export class Shape extends Entity {
	override get objectType(): ObjectType {
		return ObjectType.SHAPE;
	}

	override get objectName(): string {
		return DxfFileToken.EntityShape;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.Shape;
	}

	thickness: number = 0.0;

	insertionPoint: XYZ = new XYZ(0, 0, 0);

	size: number = 1.0;

	get shapeStyle(): TextStyle {
		return this._style;
	}
	set shapeStyle(value: TextStyle) {
		if (value == null || !value.isShapeFile) {
			throw new Error('value cannot be null and must be a shape file');
		}

		if (this.document != null) {
			this._style = CadObject.updateCollection(value, this.document.textStyles);
		} else {
			this._style = value;
		}
	}

	rotation: number = 0;

	relativeXScale: number = 1;

	obliqueAngle: number = 0;

	normal: XYZ = new XYZ(0, 0, 1);

	/** @internal */
	shapeIndex: number = 0;

	private _style!: TextStyle;

	/** @internal */
	constructor(textStyle?: TextStyle) {
		super();
		if (textStyle) {
			this.shapeStyle = textStyle;
		}
	}

	override clone(): CadObject {
		const clone = super.clone() as Shape;
		clone._style = this._style?.clone() as TextStyle;
		return clone;
	}

	override getBoundingBox(): BoundingBox {
		const width = this.size * Math.max(Math.abs(this.relativeXScale), 1e-12);
		const corners = [
			new XY(0, 0),
			new XY(width, 0),
			new XY(0, this.size),
			new XY(width, this.size),
		].map((corner) => {
			const rotated = XY.Rotate(corner, this.rotation);
			return new XYZ(this.insertionPoint.x + rotated.x, this.insertionPoint.y + rotated.y, this.insertionPoint.z);
		});

		return BoundingBox.FromPoints(corners);
	}

	override applyTransform(transform: unknown): void {
		this.insertionPoint = this.applyTransformToPoint(transform, this.insertionPoint);
		this.normal = this.transformNormal(transform, this.normal);

		if (!(transform instanceof Transform)) {
			return;
		}

		const scale = this.getTransformAxisScale(transform);
		const safeX = scale.x === 0 ? 1 : scale.x;
		const safeY = scale.y === 0 ? 1 : scale.y;
		this.rotation += transform.eulerRotation.z;
		this.size *= safeY;
		this.relativeXScale *= safeX / safeY;
	}
}
