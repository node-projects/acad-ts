import { Insert } from '../../Entities/Insert.js';
import { AttributeEntity } from '../../Entities/AttributeEntity.js';
import { Seqend } from '../../Entities/Seqend.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';
import { ICadOwnerTemplate } from './ICadOwnerTemplate.js';

export class CadInsertTemplate extends CadEntityTemplate implements ICadOwnerTemplate {
	HasAtts: boolean = false;

	OwnedObjectsCount: number = 0;

	BlockHeaderHandle: number | null = null;

	BlockName: string | null = null;

	FirstAttributeHandle: number | null = null;

	EndAttributeHandle: number | null = null;

	SeqendHandle: number | null = null;

	OwnedObjectsHandlers: Set<number> = new Set();

	constructor(insert?: Insert) {
		super(insert ?? new Insert());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const insert = this.CadObject as Insert;
		if (!(insert instanceof Insert)) return;

		const block = this.getTableReference<BlockRecord>(builder, this.BlockHeaderHandle, this.BlockName ?? '');
		if (block) {
			insert.block = block;
		} else {
			builder.Notify(`Block ${this.BlockHeaderHandle} | ${this.BlockName} not found for Insert ${this.CadObject.handle}`, NotificationType.Warning);
		}

		const seqend = builder.TryGetCadObject<Seqend>(this.SeqendHandle);
		if (seqend) {
			insert.attributes.Seqend = seqend;
			seqend.owner = insert;
		}

		if (this.FirstAttributeHandle != null) {
			const attributes = this.getEntitiesCollection<AttributeEntity>(builder, this.FirstAttributeHandle, this.EndAttributeHandle!);
			for (const att of attributes) {
				insert.attributes.push(att);
				att.owner = insert;
			}
		} else {
			for (const handle of this.OwnedObjectsHandlers) {
				const att = builder.TryGetCadObject<AttributeEntity>(handle);
				if (att) {
					insert.attributes.push(att);
					att.owner = insert;
				}
			}
		}
	}
}
