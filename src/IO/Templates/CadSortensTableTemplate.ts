import { CadObject } from '../../CadObject.js';
import { Entity } from '../../Entities/Entity.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { SortEntitiesTable } from '../../Objects/SortEntitiesTable.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadSortensTableTemplate extends CadTemplateT<SortEntitiesTable> {
	blockOwnerHandle: number | null = null;

	values: [number | null, number | null][] = [];

	constructor(cadObject?: SortEntitiesTable) {
		super(cadObject ?? new SortEntitiesTable());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const owner = builder.tryGetCadObject<CadObject>(this.blockOwnerHandle);
		if (owner) {
			if (owner instanceof BlockRecord) {
				this.cadObject.blockOwner = owner as BlockRecord;
			} else {
				builder.notify(`Block owner for SortEntitiesTable ${this.cadObject.handle} is not a block ${owner.constructor.name} | ${owner.handle}`, NotificationType.Warning);
				return;
			}
		} else {
			builder.notify(`Block owner for SortEntitiesTable ${this.cadObject.handle} not found`, NotificationType.Warning);
			return;
		}

		for (const pair of this.values) {
			const entity = builder.tryGetCadObject<Entity>(pair[1]);
			if (entity) {
				this.cadObject.add(entity, pair[0]!);
			} else {
				builder.notify(`Entity in SortEntitiesTable ${this.cadObject.handle} not found ${pair[1]}`, NotificationType.Warning);
			}
		}
	}
}
