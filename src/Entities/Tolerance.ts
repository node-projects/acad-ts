import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DimensionStyle } from '../Tables/DimensionStyle.js';
import { XYZ } from '../Math/XYZ.js';

export class Tolerance extends Entity {
	direction: XYZ = new XYZ(0, 0, 0);

	insertionPoint: XYZ = new XYZ(0, 0, 0);

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.EntityTolerance;
	}

	override get objectType(): ObjectType {
		return ObjectType.TOLERANCE;
	}

	get style(): DimensionStyle {
		return this._style;
	}
	set style(value: DimensionStyle) {
		if (value == null) {
			throw new Error('value cannot be null');
		}
		if (this.document != null) {
			this._style = CadObject.updateCollection(value, this.document.dimensionStyles);
		} else {
			this._style = value;
		}
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.Tolerance;
	}

	text: string = '';

	private _style: DimensionStyle = DimensionStyle.Default;

	override applyTransform(transform: unknown): void {
		this.direction = this.applyTransformToVector(transform, this.direction);
		if (this.direction.getLength() > 0) {
			this.direction = this.direction.normalize();
		}
		this.insertionPoint = this.applyTransformToPoint(transform, this.insertionPoint);
		this.normal = this.transformNormal(transform, this.normal);
	}

	override getBoundingBox(): BoundingBox {
		const height = Math.max(this.style.textHeight, 1e-12);
		const width = Math.max(this.text.length, 1) * height * 0.6;
		const direction = this.direction.getLength() > 0 ? this.direction.normalize() : XYZ.AxisX;
		let vertical = this.normal.cross(direction);
		if (vertical.getLength() === 0) {
			vertical = XYZ.AxisY;
		} else {
			vertical = vertical.normalize();
		}

		const corners = [
			this.insertionPoint,
			new XYZ(
				this.insertionPoint.x + direction.x * width,
				this.insertionPoint.y + direction.y * width,
				this.insertionPoint.z + direction.z * width,
			),
			new XYZ(
				this.insertionPoint.x + vertical.x * height,
				this.insertionPoint.y + vertical.y * height,
				this.insertionPoint.z + vertical.z * height,
			),
			new XYZ(
				this.insertionPoint.x + direction.x * width + vertical.x * height,
				this.insertionPoint.y + direction.y * width + vertical.y * height,
				this.insertionPoint.z + direction.z * width + vertical.z * height,
			),
		];

		return BoundingBox.FromPoints(corners);
	}
}
