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
import type { BoundingBox } from '../Math/BoundingBox.js';
import type { BlockRecord } from '../Tables/BlockRecord.js';
import type { BookColor } from '../Objects/BookColor.js';
import type { Material } from '../Objects/Material.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';
import { Transform } from '../Math/Transform.js';
import type { IProxyGeometry } from './ProxyGraphics.js';

function isBlockRecordOwner(value: unknown): value is BlockRecord {
	return value != null && typeof value === 'object' && 'blockEntity' in value;
}

export abstract class Entity extends CadObject implements IEntity {
	get bookColor(): BookColor | null { return this._bookColor; }
	set bookColor(value: BookColor | null) {
		this._bookColor = this.updateCollectionEntry(value, color => this._bookColor = color, this.document?.colors ?? null);
	}

	color: Color = Color.byLayer;

	isInvisible: boolean = false;

	get layer(): Layer {
		return this._layer;
	}
	set layer(value: Layer) {
		if (value == null) {
			throw new Error('value cannot be null');
		}
		this._layer = this.updateTableEntry(value, layer => this._layer = layer, this.document?.layers ?? null);
	}

	get lineType(): LineType {
		return this._lineType;
	}
	set lineType(value: LineType) {
		if (value == null) {
			throw new Error('value cannot be null');
		}
		this._lineType = this.updateTableEntry(value, lineType => this._lineType = lineType, this.document?.lineTypes ?? null);
	}

	lineTypeScale: number = 1.0;

	lineWeight: LineWeightType = LineWeightType.ByLayer;

	get material(): Material | null { return this._material; }
	set material(value: Material | null) {
		this._material = this.updateCollectionEntry(value, material => this._material = material, this.document?.materials ?? null);
	}

	proxyGeometries: IProxyGeometry[] = [];

	override get subclassMarker(): string {
		return DxfSubclassMarker.entity;
	}

	transparency: Transparency = Transparency.byLayer;

	private _bookColor: BookColor | null = null;
	private _layer: Layer = Layer.default;
	private _lineType: LineType = LineType.byLayer;
	private _material: Material | null = null;

	constructor() {
		super();
	}

	applyRotation(axis: XYZ, rotation: number): void {
		this.applyTransform(Transform.createRotation(axis, rotation));
	}

	applyScaling(scale: XYZ, origin?: XYZ): void {
		this.applyTransform(Transform.createScaling(scale, origin));
	}

	abstract applyTransform(transform: unknown): void;

	applyTranslation(translation: XYZ): void {
		this.applyTransform(Transform.createTranslation(translation));
	}

	override clone(): CadObject {
		const clone = super.clone() as Entity;

		clone._layer = this.layer.clone() as Layer;
		clone._lineType = this.lineType.clone() as LineType;
		clone.material = this.material?.clone?.() as Material | null ?? null;
		clone.proxyGeometries = [...this.proxyGeometries];

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
		if (this.lineType.name.toUpperCase() === LineType.byLayerName.toUpperCase()) {
			return this.layer.lineType;
		} else if (
			this.lineType.name.toUpperCase() === LineType.byBlockName.toUpperCase() &&
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

	abstract getBoundingBox(): BoundingBox | null;

	matchProperties(entity: IEntity): void {
		if (entity == null) {
			throw new Error('entity cannot be null');
		}

		if (entity.handle === 0 || this.document !== entity.document) {
			this.layer = entity.layer.clone() as Layer;
			this.lineType = entity.lineType.clone() as LineType;
			this.material = entity.material?.clone?.() as Material | null ?? null;
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

		this._layer = this.updateTableEntry(this.layer, layer => this._layer = layer, doc.layers);
		this._lineType = this.updateTableEntry(this.lineType, lineType => this._lineType = lineType, doc.lineTypes);
		this._bookColor = this.updateCollectionEntry(this._bookColor, color => this._bookColor = color, doc.colors);
		this._material = this.updateCollectionEntry(this._material, material => this._material = material, doc.materials);
	}

	/** @internal */
	unassignDocument(): void {
		this.document?.colors?.removeReference(this._bookColor?.name, this);
		this.document?.materials?.removeReference(this._material?.name, this);
		this.document?.layers?.removeReference(this.layer.name, this);
		this.document?.lineTypes?.removeReference(this.lineType.name, this);
		super.unassignDocument();

		this._layer = this.layer.clone() as Layer;
		this._lineType = this.lineType.clone() as LineType;
		this._bookColor = this._bookColor?.clone() as BookColor | null ?? null;
		this._material = this._material?.clone() as Material | null ?? null;
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

	protected applyTransformToPoint(transform: unknown, point: XYZ): XYZ {
		if (!(transform instanceof Transform)) {
			return point;
		}

		return transform.applyTransform(point);
	}

	protected applyTransformToVector(transform: unknown, vector: XYZ): XYZ {
		if (!(transform instanceof Transform)) {
			return vector;
		}

		const origin = transform.applyTransform(XYZ.zero);
		const transformed = transform.applyTransform(vector);
		return new XYZ(
			transformed.x - origin.x,
			transformed.y - origin.y,
			transformed.z - origin.z,
		);
	}

	protected getTransformAxisScale(transform: unknown): XYZ {
		if (!(transform instanceof Transform)) {
			return new XYZ(1, 1, 1);
		}

		const matrix = transform.matrix;
		return new XYZ(
			Math.hypot(matrix.m00, matrix.m10, matrix.m20),
			Math.hypot(matrix.m01, matrix.m11, matrix.m21),
			Math.hypot(matrix.m02, matrix.m12, matrix.m22),
		);
	}

	protected _tableOnRemove(sender: unknown, e: CollectionChangedEventArgs): void {
		if (e.item === this.layer) {
			this.layer = this.document!.layers.get(Layer.defaultName)!;
		}
		if (e.item === this.lineType) {
			this.lineType = this.document!.lineTypes.get(LineType.byLayerName)!;
		}
	}

	protected transformNormal(transform: unknown, normal: XYZ): XYZ {
		return this.applyTransformToVector(transform, normal).normalize();
	}
}
