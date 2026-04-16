import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { CadDocument } from '../CadDocument.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { UnderlayDisplayFlags } from './UnderlayDisplayFlags.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';
import { Transform } from '../Math/Transform.js';
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
		return DxfSubclassMarker.underlay;
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

	override applyTransform(transform: unknown): void {
		this.insertPoint = this.applyTransformToPoint(transform, this.insertPoint);
		this.normal = this.transformNormal(transform, this.normal);

		if (!(transform instanceof Transform)) {
			return;
		}

		const scale = this.getTransformAxisScale(transform);
		this.rotation += transform.eulerRotation.z;
		this.xScale *= scale.x === 0 ? 1 : scale.x;
		this.yScale *= scale.y === 0 ? 1 : scale.y;
		this.zScale *= scale.z === 0 ? 1 : scale.z;
	}

	override clone(): CadObject {
		const clone = super.clone() as UnderlayEntity;
		clone.definition = this.definition?.clone() as UnderlayDefinition | null ?? null;
		clone.clipBoundaryVertices = [...this.clipBoundaryVertices];
		return clone;
	}

	override getBoundingBox(): BoundingBox | null {
		if (this.clipBoundaryVertices.length === 0) {
			return null;
		}

		const points = this.clipBoundaryVertices.map((vertex) => {
			const scaled = new XY(vertex.x * this.xScale, vertex.y * this.yScale);
			const rotated = XY.rotate(scaled, this.rotation);
			return new XYZ(
				this.insertPoint.x + rotated.x,
				this.insertPoint.y + rotated.y,
				this.insertPoint.z,
			);
		});

		return BoundingBox.fromPoints(points);
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
