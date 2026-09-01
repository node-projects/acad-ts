import { ObjectContextData } from './ObjectContextData.js';
import { Scale } from './Scale.js';
import { CadObject } from '../CadObject.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { CadDocument } from '../CadDocument.js';

export abstract class AnnotScaleObjectContextData extends ObjectContextData {
	get scale(): Scale { return this._scale; }
	set scale(value: Scale) {
		if (!value) {
			throw new Error('value cannot be null');
		}
		this._scale = this.updateCollectionEntry(value, scale => this._scale = scale, this.document?.scales ?? null);
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

	/** @internal */
	assignDocument(doc: CadDocument): void {
		super.assignDocument(doc);
		this._scale = this.updateCollectionEntry(this._scale, scale => this._scale = scale, doc.scales);
	}

	/** @internal */
	unassignDocument(): void {
		this.document?.scales?.removeReference(this._scale.name, this);
		super.unassignDocument();
		this._scale = this._scale.clone() as Scale;
	}
}
