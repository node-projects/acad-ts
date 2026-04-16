import { Entity } from './Entity.js';
import { SeqendCollection } from './SeqendCollection.js';
import { CadObject } from '../CadObject.js';
import { CadDocument } from '../CadDocument.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { BlockRecord } from '../Tables/BlockRecord.js';
import { AttributeEntity } from './AttributeEntity.js';
import { AttributeDefinition } from './AttributeDefinition.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
import { Transform } from '../Math/Transform.js';

export class Insert extends Entity {
	attributes: SeqendCollection<AttributeEntity> = new SeqendCollection<AttributeEntity>();

	block: BlockRecord | null = null;

	columnCount: number = 1;

	columnSpacing: number = 0;

	get hasAttributes(): boolean {
		return this.attributes.length > 0;
	}

	override get hasDynamicSubclass(): boolean {
		return true;
	}

	insertPoint: XYZ = new XYZ(0, 0, 0);

	get isMultiple(): boolean {
		return this.rowCount > 1 || this.columnCount > 1;
	}

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.entityInsert;
	}

	override get objectType(): ObjectType {
		if (this.rowCount > 1 || this.columnCount > 1) {
			return ObjectType.MINSERT;
		}
		return ObjectType.INSERT;
	}

	rotation: number = 0.0;

	rowCount: number = 1;

	rowSpacing: number = 0;

	override get subclassMarker(): string {
		return this.isMultiple ? DxfSubclassMarker.mInsert : DxfSubclassMarker.insert;
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

	private _xscale: number = 1;
	private _yscale: number = 1;
	private _zscale: number = 1;

	constructor(block?: BlockRecord) {
		super();
		if (block) {
			if (block.document != null) {
				this.block = block.clone() as BlockRecord;
			} else {
				this.block = block;
			}

			const attDefs = block.attributeDefinitions;
			if (attDefs) {
				for (const item of attDefs) {
					const attribute = new AttributeEntity(item);
					this.attributes.push(attribute);
					this.applyAttributeTransform(attribute);
				}
			}
		}
	}

	override applyTransform(transform: unknown): void {
		const axisScale = this.getTransformAxisScale(transform);
		this.insertPoint = this.applyTransformToPoint(transform, this.insertPoint);
		this.normal = this.applyTransformToVector(transform, this.normal).normalize();
		this.xScale *= axisScale.x === 0 ? 1 : axisScale.x;
		this.yScale *= axisScale.y === 0 ? 1 : axisScale.y;
		this.zScale *= axisScale.z === 0 ? 1 : axisScale.z;
		if (transform instanceof Transform) {
			this.rotation += transform.eulerRotation.z;
		}

		for (const att of this.attributes) {
			att.applyTransform(transform);
		}
	}

	override clone(): CadObject {
		const clone = super.clone() as Insert;
		clone.block = this.block?.clone() as BlockRecord ?? null;
		clone.attributes = new SeqendCollection<AttributeEntity>();
		for (const att of this.attributes) {
			clone.attributes.push(att.clone() as AttributeEntity);
		}
		return clone;
	}

	*explode(): IterableIterator<Entity> {
		if (this.block == null) {
			return;
		}

		const transform = this.getTransform();
		for (const entity of this.block.getSortedEntities()) {
			if (entity instanceof AttributeDefinition) {
				continue;
			}

			const clone = entity.clone() as Entity;
			clone.applyTransform(transform);
			yield clone;
		}

		for (const attribute of this.attributes) {
			yield attribute.clone() as Entity;
		}
	}

	override getBoundingBox(): BoundingBox | null {
		const blockBounds = this.block?.getBoundingBox();
		const boxes: BoundingBox[] = [];
		if (blockBounds != null) {
			const transform = this.getTransform();
			const corners = [
				new XYZ(blockBounds.min.x, blockBounds.min.y, blockBounds.min.z),
				new XYZ(blockBounds.min.x, blockBounds.min.y, blockBounds.max.z),
				new XYZ(blockBounds.min.x, blockBounds.max.y, blockBounds.min.z),
				new XYZ(blockBounds.min.x, blockBounds.max.y, blockBounds.max.z),
				new XYZ(blockBounds.max.x, blockBounds.min.y, blockBounds.min.z),
				new XYZ(blockBounds.max.x, blockBounds.min.y, blockBounds.max.z),
				new XYZ(blockBounds.max.x, blockBounds.max.y, blockBounds.min.z),
				new XYZ(blockBounds.max.x, blockBounds.max.y, blockBounds.max.z),
			].map((corner) => transform.applyTransform(corner));
			boxes.push(BoundingBox.fromPoints(corners));
		}

		for (const attribute of this.attributes) {
			const bounds = attribute.getBoundingBox();
			if (bounds != null) {
				boxes.push(bounds);
			}
		}

		return boxes.length > 0
			? BoundingBox.fromPoints(boxes.flatMap((box) => [box.min, box.max]))
			: null;
	}

	getTransform(): Transform {
		return new Transform(
			this.insertPoint,
			new XYZ(this.xScale, this.yScale, this.zScale),
			new XYZ(0, 0, this.rotation),
		);
	}

	applyAttributeTransform(attribute: AttributeEntity): void {
		attribute.applyTransform(this.getTransform());
	}

	updateAttributes(): void {
		if (!this.block) return;
		const attDefs: AttributeDefinition[] = this.block.attributeDefinitions ?? [];
		const defTags = attDefs.map(d => d.tag);
		const attTags = this.attributes.map(a => a.tag);

		const filtered = new SeqendCollection<AttributeEntity>(...this.attributes.filter(att => defTags.includes(att.tag)));
		filtered.seqend = this.attributes.seqend;
		this.attributes = filtered;

		for (const attdef of attDefs) {
			if (!attTags.includes(attdef.tag)) {
				const attribute = new AttributeEntity(attdef);
				this.attributes.push(attribute);
				this.applyAttributeTransform(attribute);
			}
		}
	}

	/** @internal */
	assignDocument(doc: CadDocument): void {
		super.assignDocument(doc);

		if (this.block == null) return;

		const existing = doc.blockRecords?.tryGetValue(this.block.name);
		if (existing) {
			this.block = existing;
		} else {
			doc.blockRecords?.add(this.block);
		}
	}

	/** @internal */
	unassignDocument(): void {
		this.block = this.block?.clone() as BlockRecord ?? null;
		super.unassignDocument();
	}
}
