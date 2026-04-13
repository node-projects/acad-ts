import { Block } from '../Blocks/Block.js';
import { BlockEnd } from '../Blocks/BlockEnd.js';
import { BlockTypeFlags } from '../Blocks/BlockTypeFlags.js';
import { CadObject } from '../CadObject.js';
import { CadObjectCollection } from '../CadObjectCollection.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { UnitsType } from '../Types/Units/UnitsType.js';
import { TableEntry } from './TableEntry.js';

// TODO: Entity, Layout, EvaluationGraph, SortEntitiesTable, Viewport, AttributeDefinition
// These types are not yet converted; using 'any' placeholders.

export class BlockRecord extends TableEntry {
	public static get ModelSpace(): BlockRecord {
		const record = new BlockRecord(BlockRecord.ModelSpaceName);
		// TODO: Create Layout and assign when Layout type is available
		return record;
	}

	public static get PaperSpace(): BlockRecord {
		const record = new BlockRecord(BlockRecord.PaperSpaceName);
		// TODO: Create Layout and assign when Layout type is available
		return record;
	}

	public get attributeDefinitions(): any[] /* AttributeDefinition[] */ {
		return Array.from(this.entities).filter((e: any) => e.constructor?.name === 'AttributeDefinition');
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

	public entities: CadObjectCollection<any> /* CadObjectCollection<Entity> */;

	public get evaluationGraph(): any /* EvaluationGraph */ {
		// TODO: Implement when XDictionary/EvaluationGraph types are available
		return null;
	}

	public get blockFlags(): BlockTypeFlags {
		return this.blockEntity.flags;
	}
	public set blockFlags(value: BlockTypeFlags) {
		this.blockEntity.flags = value;
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

	public get isUnloaded(): boolean {
		return this.blockEntity.isUnloaded;
	}
	public set isUnloaded(value: boolean) {
		this.blockEntity.isUnloaded = value;
	}

	public get layout(): any /* Layout */ {
		return this._layout;
	}
	public set layout(value: any /* Layout */) {
		this._layout = value;
	}

	public override get objectName(): string {
		return DxfFileToken.TableBlockRecord;
	}

	public override get objectType(): ObjectType {
		return ObjectType.BLOCK_HEADER;
	}

	public preview: Uint8Array | null = null;

	public get sortEntitiesTable(): any /* SortEntitiesTable */ {
		// TODO: Implement when XDictionary/SortEntitiesTable types are available
		return null;
	}

	public get source(): BlockRecord | null {
		// TODO: Implement when ExtendedData resolution is available
		return null;
	}

	public override get subclassMarker(): string {
		return DxfSubclassMarker.BlockRecord;
	}

	public units: UnitsType = UnitsType.Unitless;

	public get viewports(): any[] /* Viewport[] */ {
		return Array.from(this.entities).filter((e: any) => e.constructor?.name === 'Viewport');
	}

	public static readonly AnonymousPrefix: string = '*A';
	public static readonly ModelSpaceName: string = '*Model_Space';
	public static readonly PaperSpaceName: string = '*Paper_Space';

	private _blockEnd!: BlockEnd;
	private _blockEntity!: Block;
	private _layout: any /* Layout */ = null;

	public constructor(name?: string) {
		super(name);
		this._blockEntity = new Block(this);
		this._blockEnd = new BlockEnd(this);
		this.entities = new CadObjectCollection<any>(this);
	}

	// TODO: xref constructor (name, xrefFile, isOverlay)

	public override clone(): CadObject {
		const clone = super.clone() as BlockRecord;

		clone._layout = null;

		// TODO: SortEntitiesTable cloning when available

		clone.entities = new CadObjectCollection<any>(clone);
		for (const item of this.entities) {
			const e = item.clone();
			clone.entities.add(e);
		}

		clone.blockEntity = this.blockEntity.clone() as Block;
		clone.blockEntity.owner = clone;
		clone.blockEnd = this.blockEnd.clone() as BlockEnd;
		clone.blockEnd.owner = clone;

		return clone;
	}

	// TODO: createSortEntitiesTable()
	// TODO: getBoundingBox()
	// TODO: getSortedEntities()
}

export { BlockTypeFlags } from '../Blocks/BlockTypeFlags.js';
