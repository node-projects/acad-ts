import { CadObject } from '../../CadObject.js';
import { Entity } from '../../Entities/Entity.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { SortEntitiesTable } from '../../Objects/SortEntitiesTable.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadSortensTableTemplate extends CadTemplateT<SortEntitiesTable> {
	BlockOwnerHandle: number | null = null;

	Values: [number | null, number | null][] = [];

	constructor(cadObject?: SortEntitiesTable) {
		super(cadObject ?? new SortEntitiesTable());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const owner = builder.TryGetCadObject<CadObject>(this.BlockOwnerHandle);
		if (owner) {
			if (owner instanceof BlockRecord) {
				this.CadObject.blockOwner = owner as BlockRecord;
			} else {
				builder.Notify(`Block owner for SortEntitiesTable ${this.CadObject.handle} is not a block ${owner.constructor.name} | ${owner.handle}`, NotificationType.Warning);
				return;
			}
		} else {
			builder.Notify(`Block owner for SortEntitiesTable ${this.CadObject.handle} not found`, NotificationType.Warning);
			return;
		}

		for (const pair of this.Values) {
			const entity = builder.TryGetCadObject<Entity>(pair[1]);
			if (entity) {
				this.CadObject.add(entity, pair[0]!);
			} else {
				builder.Notify(`Entity in SortEntitiesTable ${this.CadObject.handle} not found ${pair[1]}`, NotificationType.Warning);
			}
		}
	}
}
