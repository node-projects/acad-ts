import { ObjectContextData } from './ObjectContextData.js';
import { Scale } from './Scale.js';
import { CadObject } from '../CadObject.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';

export abstract class AnnotScaleObjectContextData extends ObjectContextData {
	get scale(): Scale { return this._scale; }
	set scale(value: Scale) {
		if (!value) {
			throw new Error('value cannot be null');
		}
		if (this.document != null) {
			this._scale = CadObject.updateCollection(value, this.document.scales);
		} else {
			this._scale = value;
		}
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.annotScaleObjectContextData;
	}

	private _scale: Scale = Scale.default;

	override clone(): CadObject {
		const clone = super.clone() as AnnotScaleObjectContextData;
		clone._scale = this._scale?.clone() as Scale;
		return clone;
	}
}
