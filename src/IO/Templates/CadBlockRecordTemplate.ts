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
	BeginBlockHandle: number | null = null;

	BlockEntityTemplate: CadBlockEntityTemplate | null = null;

	EndBlockHandle: number | null = null;

	FirstEntityHandle: number | null = null;

	InsertHandles: number[] = [];

	LastEntityHandle: number | null = null;

	LayoutHandle: number | null = null;

	OwnedObjectsHandlers: Set<number> = new Set();

	ReferenceTemplates: Set<CadEntityTemplate> = new Set();

	constructor(block?: BlockRecord) {
		super(block ?? new BlockRecord());
	}

	SetBlockToRecord(builder: CadDocumentBuilder, headerHandles: DwgHeaderHandlesCollection): void {
		const block = builder.TryGetCadObject<Block>(this.BeginBlockHandle);
		if (block) {
			if (block.name && block.name.length > 0) {
				this.CadObject.name = block.name;
			}

			block.flags = this.CadObject.blockEntity.flags;
			block.basePoint = this.CadObject.blockEntity.basePoint;
			block.xRefPath = this.CadObject.blockEntity.xRefPath;
			block.comments = this.CadObject.blockEntity.comments;
			block.isUnloaded = this.CadObject.blockEntity.isUnloaded;

			this.CadObject.blockEntity = block;
		}

		const blockEnd = builder.TryGetCadObject<BlockEnd>(this.EndBlockHandle);
		if (blockEnd) {
			this.CadObject.blockEnd = blockEnd;
		}

		this.ensureCorrectNaming(builder, headerHandles.MODEL_SPACE, BlockRecord.ModelSpaceName);
		this.ensureCorrectNaming(builder, headerHandles.PAPER_SPACE, BlockRecord.PaperSpaceName);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const layout = builder.TryGetCadObject<Layout>(this.LayoutHandle);
		if (layout) {
			this.CadObject.layout = layout;
		}

		if (this.FirstEntityHandle != null && this.FirstEntityHandle !== 0) {
			for (const e of this.getEntitiesCollection<Entity>(builder, this.FirstEntityHandle, this.LastEntityHandle!)) {
				this.addEntity(builder, e);
			}
		} else {
			if (this.BlockEntityTemplate !== null) {
				for (const h of this.BlockEntityTemplate.OwnedObjectsHandlers) {
					this.OwnedObjectsHandlers.add(h);
				}
			}

			for (const handle of this.OwnedObjectsHandlers) {
				const child = builder.TryGetCadObject<Entity>(handle);
				if (child) {
					this.addEntity(builder, child);
				}
			}
		}

		for (const item of this.ReferenceTemplates) {
			this.addEntity(builder, item.CadObject);
		}
	}

	private addEntity(builder: CadDocumentBuilder, entity: Entity): void {
		if (!builder.KeepUnknownEntities && entity instanceof UnknownEntity) {
			return;
		}

		this.CadObject.entities.add(entity);
	}

	private ensureCorrectNaming(builder: CadDocumentBuilder, handle: number | null, expected: string): void {
		if (this.CadObject.handle === handle
			&& this.CadObject.name.toLowerCase() !== expected.toLowerCase()) {
			builder.Notify(`Invalid name for ${this.CadObject.name} changed to ${expected}`, NotificationType.Warning);
			this.CadObject.name = expected;
		}
	}
}
