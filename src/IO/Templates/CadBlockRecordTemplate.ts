import { Block } from '../../Blocks/Block.js';
import { BlockEnd } from '../../Blocks/BlockEnd.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { Entity } from '../../Entities/Entity.js';
import { UnknownEntity } from '../../Entities/UnknownEntity.js';
import { Layout } from '../../Objects/Layout.js';
import { DwgHeaderHandlesCollection } from '../DWG/DwgHeaderHandlesCollection.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadBlockEntityTemplate } from './CadBlockEntityTemplate.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';
import { ICadOwnerTemplate } from './ICadOwnerTemplate.js';

export class CadBlockRecordTemplate extends CadTableEntryTemplate<BlockRecord> implements ICadOwnerTemplate {
	beginBlockHandle: number | null = null;

	blockEntityTemplate: CadBlockEntityTemplate | null = null;

	endBlockHandle: number | null = null;

	firstEntityHandle: number | null = null;

	insertHandles: number[] = [];

	lastEntityHandle: number | null = null;

	layoutHandle: number | null = null;

	ownedObjectsHandlers: Set<number> = new Set();

	referenceTemplates: Set<CadEntityTemplate> = new Set();

	constructor(block?: BlockRecord) {
		super(block ?? new BlockRecord());
	}

	setBlockToRecord(builder: CadDocumentBuilder, headerHandles: DwgHeaderHandlesCollection): void {
		const block = builder.tryGetCadObject<Block>(this.beginBlockHandle);
		if (block) {
			if (block.name && block.name.length > 0) {
				this.cadObject.name = block.name;
			}

			block.flags = this.cadObject.blockEntity.flags;
			block.basePoint = this.cadObject.blockEntity.basePoint;
			block.xRefPath = this.cadObject.blockEntity.xRefPath;
			block.comments = this.cadObject.blockEntity.comments;
			block.isUnloaded = this.cadObject.blockEntity.isUnloaded;

			this.cadObject.blockEntity = block;
		}

		const blockEnd = builder.tryGetCadObject<BlockEnd>(this.endBlockHandle);
		if (blockEnd) {
			this.cadObject.blockEnd = blockEnd;
		}

		this._ensureCorrectNaming(builder, headerHandles.model_space, BlockRecord.modelSpaceName);
		this._ensureCorrectNaming(builder, headerHandles.paper_space, BlockRecord.paperSpaceName);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);
		this.cadObject.insertHandles = [...this.insertHandles];
		this.cadObject.ownedObjectHandles = Array.from(this.ownedObjectsHandlers);

		const layout = builder.tryGetCadObject<Layout>(this.layoutHandle);
		if (layout) {
			this.cadObject.layout = layout;
		}

		if (this.firstEntityHandle != null && this.firstEntityHandle !== 0) {
			for (const e of this.getEntitiesCollection<Entity>(builder, this.firstEntityHandle, this.lastEntityHandle!)) {
				this._addEntity(builder, e);
			}
		} else {
			if (this.blockEntityTemplate !== null) {
				for (const h of this.blockEntityTemplate.ownedObjectsHandlers) {
					this.ownedObjectsHandlers.add(h);
				}
			}

			for (const handle of this.ownedObjectsHandlers) {
				const child = builder.tryGetCadObject<Entity>(handle);
				if (child) {
					this._addEntity(builder, child);
				}
			}
		}

		for (const item of this.referenceTemplates) {
			this._addEntity(builder, item.cadObject);
		}
	}

	private _addEntity(builder: CadDocumentBuilder, entity: Entity): void {
		if (!builder.keepUnknownEntities && entity instanceof UnknownEntity) {
			return;
		}

		this.cadObject.entities.add(entity);
	}

	private _ensureCorrectNaming(builder: CadDocumentBuilder, handle: number | null, expected: string): void {
		if (this.cadObject.handle === handle
			&& this.cadObject.name.toLowerCase() !== expected.toLowerCase()) {
			builder.notify(`Invalid name for ${this.cadObject.name} changed to ${expected}`, NotificationType.Warning);
			this.cadObject.name = expected;
		}
	}
}
