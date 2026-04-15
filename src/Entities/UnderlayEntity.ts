import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { CadDocument } from '../CadDocument.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { UnderlayDisplayFlags } from './UnderlayDisplayFlags.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import type { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';
import type { UnderlayDefinition } from '../Objects/UnderlayDefinition.js';

export abstract class UnderlayEntity extends Entity {
	clipBoundaryVertices: XY[] = [];

	get contrast(): number {
		return this._contrast;
	}
	set contrast(value: number) {
		if (value < 0 || value > 100) {
			throw new Error(`Invalid Contrast value: ${value}, must be in range 0-100`);
		}
		this._contrast = value;
	}

	definition: UnderlayDefinition | null = null;

	get fade(): number {
		return this._fade;
	}
	set fade(value: number) {
		if (value < 0 || value > 100) {
			throw new Error(`Invalid Fade value: ${value}, must be in range 0-100`);
		}
		this._fade = value;
	}

	flags: UnderlayDisplayFlags = UnderlayDisplayFlags.Default;

	insertPoint: XYZ = new XYZ(0, 0, 0);

	normal: XYZ = new XYZ(0, 0, 1);

	rotation: number = 0.0;

	override get subclassMarker(): string {
		return DxfSubclassMarker.Underlay;
	}

	get xScale(): number {
		return this._xscale;
	}
	set xScale(value: number) {
		if (value === 0) {
			throw new Error('XScale value must be non-zero.');
		}
		this._xscale = value;
	}

	get yScale(): number {
		return this._yscale;
	}
	set yScale(value: number) {
		if (value === 0) {
			throw new Error('YScale value must be non-zero.');
		}
		this._yscale = value;
	}

	get zScale(): number {
		return this._zscale;
	}
	set zScale(value: number) {
		if (value === 0) {
			throw new Error('ZScale value must be non-zero.');
		}
		this._zscale = value;
	}

	private _contrast: number = 100;
	private _fade: number = 0;
	private _xscale: number = 1;
	private _yscale: number = 1;
	private _zscale: number = 1;

	constructor(definition?: UnderlayDefinition) {
		super();
		if (definition) {
			this.definition = definition;
		}
	}

	override applyTransform(transform: any): void {
		// TODO: Complex transform with world matrix
	}

	override clone(): CadObject {
		const clone = super.clone() as UnderlayEntity;
		clone.definition = this.definition?.clone() as UnderlayDefinition | null ?? null;
		clone.clipBoundaryVertices = [...this.clipBoundaryVertices];
		return clone;
	}

	override getBoundingBox(): BoundingBox | null {
		return null;
	}

	/** @internal */
	assignDocument(doc: CadDocument): void {
		super.assignDocument(doc);
	}

	/** @internal */
	unassignDocument(): void {
		super.unassignDocument();
		this.definition = this.definition?.clone() as UnderlayDefinition | null ?? null;
	}
}
