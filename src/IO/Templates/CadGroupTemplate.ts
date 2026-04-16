import { Entity } from '../../Entities/Entity.js';
import { Group } from '../../Objects/Group.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadGroupTemplate extends CadTemplateT<Group> {
	handles: Set<number> = new Set();

	constructor(group?: Group) {
		super(group ?? new Group());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		for (const handle of this.handles) {
			const e = builder.getObjectTemplate<CadEntityTemplate>(handle);
			if (e) {
				e.build(builder);

				try {
					this.cadObject.add(e.cadObject);
				} catch (ex: unknown) {
					builder.notify(`Entity with handle ${handle} could not be added to group ${this.cadObject.handle}`, NotificationType.Error, ex instanceof Error ? ex : null);
				}
			} else {
				builder.notify(`Entity with handle ${handle} not found for group ${this.cadObject.handle}`, NotificationType.Warning);
			}
		}
	}
}
