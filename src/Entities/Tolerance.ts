import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
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

	override applyTransform(transform: any): void {
		// TODO: transform operations not available
	}

	override getBoundingBox(): any {
		return null;
	}
}
