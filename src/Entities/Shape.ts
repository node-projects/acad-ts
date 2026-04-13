import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
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

	override getBoundingBox(): any {
		return null;
	}

	override applyTransform(transform: any): void {
		// TODO: transform operations not available
	}
}
