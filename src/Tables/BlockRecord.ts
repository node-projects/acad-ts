import { Block } from '../Blocks/Block.js';
import { BlockEnd } from '../Blocks/BlockEnd.js';
import { BlockTypeFlags } from '../Blocks/BlockTypeFlags.js';
import { CadObject } from '../CadObject.js';
import { CadObjectCollection } from '../CadObjectCollection.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { AttributeDefinition } from '../Entities/AttributeDefinition.js';
import { Entity } from '../Entities/Entity.js';
import { Viewport } from '../Entities/Viewport.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
import { CadDictionary } from '../Objects/CadDictionary.js';
import { EvaluationGraph } from '../Objects/Evaluations/EvaluationGraph.js';
import { Layout } from '../Objects/Layout.js';
import { SortEntitiesTable } from '../Objects/SortEntitiesTable.js';
import { ObjectType } from '../Types/ObjectType.js';
import { UnitsType } from '../Types/Units/UnitsType.js';
import { TableEntry } from './TableEntry.js';

export class BlockRecord extends TableEntry {
	public static get ModelSpace(): BlockRecord {
		const record = new BlockRecord(BlockRecord.ModelSpaceName);
		const layout = new Layout(Layout.ModelLayoutName);
		layout.associatedBlock = record;
		return record;
	}

	public static get PaperSpace(): BlockRecord {
		const record = new BlockRecord(BlockRecord.PaperSpaceName);
		const layout = new Layout(Layout.PaperLayoutName);
		layout.associatedBlock = record;
		return record;
	}

	public get attributeDefinitions(): AttributeDefinition[] {
		return Array.from(this.entities).filter((e): e is AttributeDefinition => e instanceof AttributeDefinition);
	}

	public get blockEnd(): BlockEnd {
		return this._blockEnd;
	}
	public set blockEnd(value: BlockEnd) {
		this._blockEnd = value;
		this._blockEnd.owner = this;
	}

	public get blockEntity(): Block {
		return this._blockEntity;
	}
	public set blockEntity(value: Block) {
		this._blockEntity = value;
		this._blockEntity.owner = this;
	}

	public canScale: boolean = true;

	public entities: CadObjectCollection<Entity>;

	public get evaluationGraph(): EvaluationGraph | null {
		return this.xDictionary?.getEntry<EvaluationGraph>(EvaluationGraph.DictionaryEntryName) ?? null;
	}

	public get blockFlags(): BlockTypeFlags {
		return this.blockEntity.flags;
	}
	public set blockFlags(value: BlockTypeFlags) {
		this.blockEntity.flags = value;
	}

	public get combinedFlags(): BlockTypeFlags {
		return (this.blockEntity.flags | (this.flags as unknown as BlockTypeFlags)) as BlockTypeFlags;
	}

	public get hasAttributes(): boolean {
		return this.attributeDefinitions.length > 0;
	}

	public get isAnonymous(): boolean {
		return (this.blockFlags & BlockTypeFlags.Anonymous) !== 0;
	}
	public set isAnonymous(value: boolean) {
		if (value) {
			this.blockFlags |= BlockTypeFlags.Anonymous;
		} else {
			this.blockFlags &= ~BlockTypeFlags.Anonymous;
		}
	}

	public get isDynamic(): boolean {
		return this.evaluationGraph != null;
	}

	public isExplodable: boolean = false;
	public insertHandles: number[] = [];
	public ownedObjectHandles: number[] = [];

	public get isUnloaded(): boolean {
		return this.blockEntity.isUnloaded;
	}
	public set isUnloaded(value: boolean) {
		this.blockEntity.isUnloaded = value;
	}

	public get layout(): Layout | null {
		return this._layout;
	}
	public set layout(value: Layout | null) {
		this._layout = value;
	}

	public override get objectName(): string {
		return DxfFileToken.TableBlockRecord;
	}

	public override get objectType(): ObjectType {
		return ObjectType.BLOCK_HEADER;
	}

	public preview: Uint8Array | null = null;

	public get sortEntitiesTable(): SortEntitiesTable | null {
		return this.xDictionary?.getEntry<SortEntitiesTable>(SortEntitiesTable.DictionaryEntryName) ?? null;
	}

	public get source(): BlockRecord | null {
		// TODO: Implement when ExtendedData resolution is available
		return null;
	}

	public override get subclassMarker(): string {
		return DxfSubclassMarker.BlockRecord;
	}

	public units: UnitsType = UnitsType.Unitless;

	public get viewports(): Viewport[] {
		return Array.from(this.entities).filter((e): e is Viewport => e instanceof Viewport);
	}

	public static readonly AnonymousPrefix: string = '*A';
	public static readonly ModelSpaceName: string = '*Model_Space';
	public static readonly PaperSpaceName: string = '*Paper_Space';

	private _blockEnd!: BlockEnd;
	private _blockEntity!: Block;
	private _layout: Layout | null = null;

	public constructor(name?: string) {
		super(name);
		this._blockEntity = new Block(this);
		this._blockEnd = new BlockEnd(this);
		this.entities = new CadObjectCollection<Entity>(this);
	}

	// TODO: xref constructor (name, xrefFile, isOverlay)

	public override clone(): CadObject {
		const clone = super.clone() as BlockRecord;

		clone._layout = null;
		clone.insertHandles = [...this.insertHandles];
		clone.ownedObjectHandles = [...this.ownedObjectHandles];

		clone.entities = new CadObjectCollection<Entity>(clone);
		const entityMap = new Map<Entity, Entity>();
		for (const item of this.entities) {
			const entity = item.clone() as Entity;
			clone.entities.add(entity);
			entityMap.set(item, entity);
		}

		if (this.layout != null) {
			const layout = this.layout.clone() as Layout;
			layout.associatedBlock = clone;
		}

		const sortTable = clone.sortEntitiesTable;
		if (sortTable != null) {
			sortTable.blockOwner = clone;
			sortTable.clear();
			for (const sorter of this.sortEntitiesTable ?? []) {
				const entity = entityMap.get(sorter.entity as Entity);
				if (entity != null) {
					sortTable.add(entity, sorter.sortHandle);
				}
			}
		}

		clone.blockEntity = this.blockEntity.clone() as Block;
		clone.blockEntity.owner = clone;
		clone.blockEnd = this.blockEnd.clone() as BlockEnd;
		clone.blockEnd.owner = clone;

		return clone;
	}

	public createSortEntitiesTable(): SortEntitiesTable {
		let table = this.sortEntitiesTable;
		if (table != null) {
			return table;
		}

		if (this.xDictionary == null) {
			this.xDictionary = new CadDictionary();
		}

		table = new SortEntitiesTable(this);
		this.xDictionary.addByKey(SortEntitiesTable.DictionaryEntryName, table);
		return table;
	}

	public getBoundingBox(): BoundingBox | null {
		let bounds: BoundingBox | null = null;

		for (const entity of this.getSortedEntities()) {
			const entityBounds = entity.getBoundingBox() as BoundingBox | null;
			if (entityBounds == null) {
				continue;
			}

			if (bounds == null) {
				bounds = new BoundingBox(
					new XYZ(entityBounds.min.x, entityBounds.min.y, entityBounds.min.z),
					new XYZ(entityBounds.max.x, entityBounds.max.y, entityBounds.max.z),
				);
				continue;
			}

			bounds.min.x = Math.min(bounds.min.x, entityBounds.min.x);
			bounds.min.y = Math.min(bounds.min.y, entityBounds.min.y);
			bounds.min.z = Math.min(bounds.min.z, entityBounds.min.z);
			bounds.max.x = Math.max(bounds.max.x, entityBounds.max.x);
			bounds.max.y = Math.max(bounds.max.y, entityBounds.max.y);
			bounds.max.z = Math.max(bounds.max.z, entityBounds.max.z);
		}

		return bounds;
	}

	public getSortedEntities(): Entity[] {
		const entities = Array.from(this.entities);
		const sortTable = this.sortEntitiesTable;
		if (sortTable == null) {
			return entities;
		}

		const remaining = new Set(entities);
		const ordered: Entity[] = [];
		for (const sorter of sortTable) {
			const entity = sorter.entity as Entity | null;
			if (entity != null && remaining.has(entity)) {
				ordered.push(entity);
				remaining.delete(entity);
			}
		}

		ordered.push(...remaining);
		return ordered;
	}
}

export { BlockTypeFlags } from '../Blocks/BlockTypeFlags.js';
