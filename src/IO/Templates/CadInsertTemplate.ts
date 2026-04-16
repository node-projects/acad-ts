import { Insert } from '../../Entities/Insert.js';
import { AttributeEntity } from '../../Entities/AttributeEntity.js';
import { Seqend } from '../../Entities/Seqend.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';
import { ICadOwnerTemplate } from './ICadOwnerTemplate.js';

export class CadInsertTemplate extends CadEntityTemplate implements ICadOwnerTemplate {
	hasAtts: boolean = false;

	ownedObjectsCount: number = 0;

	blockHeaderHandle: number | null = null;

	blockName: string | null = null;

	firstAttributeHandle: number | null = null;

	endAttributeHandle: number | null = null;

	seqendHandle: number | null = null;

	ownedObjectsHandlers: Set<number> = new Set();

	constructor(insert?: Insert) {
		super(insert ?? new Insert());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const insert = this.cadObject as Insert;
		if (!(insert instanceof Insert)) return;

		const block = this.getTableReference<BlockRecord>(builder, this.blockHeaderHandle, this.blockName ?? '');
		if (block) {
			insert.block = block;
		} else {
			builder.notify(`Block ${this.blockHeaderHandle} | ${this.blockName} not found for Insert ${this.cadObject.handle}`, NotificationType.Warning);
		}

		const seqend = builder.tryGetCadObject<Seqend>(this.seqendHandle);
		if (seqend) {
			insert.attributes.seqend = seqend;
			seqend.owner = insert;
		}

		if (this.firstAttributeHandle != null) {
			const attributes = this.getEntitiesCollection<AttributeEntity>(builder, this.firstAttributeHandle, this.endAttributeHandle!);
			for (const att of attributes) {
				insert.attributes.push(att);
				att.owner = insert;
				insert.applyAttributeTransform(att);
			}
		} else {
			for (const handle of this.ownedObjectsHandlers) {
				const att = builder.tryGetCadObject<AttributeEntity>(handle);
				if (att) {
					insert.attributes.push(att);
					att.owner = insert;
					insert.applyAttributeTransform(att);
				}
			}
		}
	}
}
