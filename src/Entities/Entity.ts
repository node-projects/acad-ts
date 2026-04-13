import { CadObject } from '../CadObject.js';
import { CadDocument } from '../CadDocument.js';
import { IEntity } from './IEntity.js';
import { Color } from '../Color.js';
import { Layer } from '../Tables/Layer.js';
import { LineType } from '../Tables/LineType.js';
import { LineWeightType } from '../Types/LineWeightType.js';
import { Transparency } from '../Transparency.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import type { BlockRecord } from '../Tables/BlockRecord.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';

function isBlockRecordOwner(value: unknown): value is BlockRecord {
	return value != null && typeof value === 'object' && 'blockEntity' in (value as any);
}

export abstract class Entity extends CadObject implements IEntity {
	bookColor: any /* BookColor */ = null;

	color: Color = Color.ByLayer;

	isInvisible: boolean = false;

	get layer(): Layer {
		return this._layer;
	}
	set layer(value: Layer) {
		if (value == null) {
			throw new Error('value cannot be null');
		}
		this._layer = CadObject.updateCollection(value, this.document?.layers ?? null);
	}

	get lineType(): LineType {
		return this._lineType;
	}
	set lineType(value: LineType) {
		if (value == null) {
			throw new Error('value cannot be null');
		}
		this._lineType = CadObject.updateCollection(value, this.document?.lineTypes ?? null);
	}

	lineTypeScale: number = 1.0;

	lineWeight: LineWeightType = LineWeightType.ByLayer;

	material: any /* Material */ = null;

	override get subclassMarker(): string {
		return DxfSubclassMarker.Entity;
	}

	transparency: Transparency = Transparency.ByLayer;

	private _bookColor: any /* BookColor */ = null;
	private _layer: Layer = Layer.Default;
	private _lineType: LineType = LineType.ByLayer;

	constructor() {
		super();
	}

	applyRotation(axis: XYZ, rotation: number): void {
		// TODO: Transform.CreateRotation not available
		// const transform = Transform.CreateRotation(axis, rotation);
		// this.applyTransform(transform);
	}

	applyScaling(scale: XYZ, origin?: XYZ): void {
		// TODO: Transform.CreateScaling not available
	}

	abstract applyTransform(transform: any /* Transform */): void;

	applyTranslation(translation: XYZ): void {
		// TODO: Transform.CreateTranslation not available
	}

	override clone(): CadObject {
		const clone = super.clone() as Entity;

		clone._layer = this.layer.clone() as Layer;
		clone._lineType = this.lineType.clone() as LineType;
		clone.material = this.material?.clone?.() ?? null;

		return clone;
	}

	getActiveColor(): Color {
		let color: Color;
		if (this.color.isByLayer) {
			color = this.layer.color;
		} else if (this.color.isByBlock && isBlockRecordOwner(this.owner)) {
			color = (this.owner as BlockRecord).blockEntity.color;
		} else {
			color = this.color;
		}
		return color;
	}

	getActiveLineType(): LineType {
		if (this.lineType.name.toUpperCase() === LineType.ByLayerName.toUpperCase()) {
			return this.layer.lineType;
		} else if (
			this.lineType.name.toUpperCase() === LineType.ByBlockName.toUpperCase() &&
			isBlockRecordOwner(this.owner)
		) {
			return (this.owner as BlockRecord).blockEntity.lineType;
		}
		return this.lineType;
	}

	getActiveLineWeightType(): LineWeightType {
		switch (this.lineWeight) {
			case LineWeightType.ByLayer:
				return this.layer.lineWeight;
			case LineWeightType.ByBlock:
				if (isBlockRecordOwner(this.owner)) {
					return (this.owner as BlockRecord).blockEntity.getActiveLineWeightType();
				} else {
					return this.lineWeight;
				}
			default:
				return this.lineWeight;
		}
	}

	abstract getBoundingBox(): any /* BoundingBox */;

	matchProperties(entity: IEntity): void {
		if (entity == null) {
			throw new Error('entity cannot be null');
		}

		if (entity.handle === 0 || this.document !== entity.document) {
			this.layer = entity.layer.clone() as Layer;
			this.lineType = entity.lineType.clone() as LineType;
			this.material = entity.material?.clone?.() ?? null;
		} else {
			this.layer = entity.layer;
			this.lineType = entity.lineType;
			this.material = entity.material;
		}

		this.color = entity.color;
		this.lineWeight = entity.lineWeight;
		this.lineTypeScale = entity.lineTypeScale;
		this.isInvisible = entity.isInvisible;
		this.transparency = entity.transparency;
	}

	/** @internal */
	assignDocument(doc: CadDocument): void {
		super.assignDocument(doc);

		this._layer = CadObject.updateCollection(this.layer, doc.layers);
		this._lineType = CadObject.updateCollection(this.lineType, doc.lineTypes);

		doc.layers.onRemove = this._tableOnRemove.bind(this);
		doc.lineTypes.onRemove = this._tableOnRemove.bind(this);
	}

	/** @internal */
	unassignDocument(): void {
		// TODO: Remove event listeners properly
		super.unassignDocument();

		this._layer = this.layer.clone() as Layer;
		this._lineType = this.lineType.clone() as LineType;
	}

	protected applyRotationToPoints(points: XY[], rotation: number): XY[] {
		if (points == null) {
			throw new Error('points cannot be null');
		}

		if (Math.abs(rotation) < 1e-12) {
			return [...points];
		}

		const sin = Math.sin(rotation);
		const cos = Math.cos(rotation);

		const transPoints: XY[] = [];
		for (const p of points) {
			transPoints.push(new XY(p.x * cos - p.y * sin, p.x * sin + p.y * cos));
		}
		return transPoints;
	}

	protected applyWorldMatrix(
		xyz: XYZ,
		transform: any /* Transform */,
		transOW: any /* Matrix3 */,
		transWO: any /* Matrix3 */
	): XYZ {
		// TODO: Matrix3 operations not available
		return xyz;
	}

	protected getWorldMatrix(
		transform: any /* Transform */,
		normal: XYZ,
		newNormal: XYZ
	): { matrix: any; transOW: any; transWO: any } {
		// TODO: Matrix3.ArbitraryAxis not available
		return { matrix: null, transOW: null, transWO: null };
	}

	protected _tableOnRemove(sender: any, e: CollectionChangedEventArgs): void {
		if (e.item === this.layer) {
			this.layer = this.document!.layers.get(Layer.DefaultName)!;
		}
		if (e.item === this.lineType) {
			this.lineType = this.document!.lineTypes.get(LineType.ByLayerName)!;
		}
	}

	protected transformNormal(transform: any /* Transform */, normal: XYZ): XYZ {
		// TODO: transform.ApplyRotation and Normalize not available
		return normal;
	}
}
