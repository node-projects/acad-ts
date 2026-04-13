import { Entity } from '../../Entities/Entity.js';
import { Group } from '../../Objects/Group.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadGroupTemplate extends CadTemplateT<Group> {
	Handles: Set<number> = new Set();

	constructor(group?: Group) {
		super(group ?? new Group());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		for (const handle of this.Handles) {
			const e = builder.GetObjectTemplate<CadEntityTemplate>(handle);
			if (e) {
				e.Build(builder);

				try {
					this.CadObject.add(e.CadObject);
				} catch (ex: any) {
					builder.Notify(`Entity with handle ${handle} could not be added to group ${this.CadObject.handle}`, NotificationType.Error, ex);
				}
			} else {
				builder.Notify(`Entity with handle ${handle} not found for group ${this.CadObject.handle}`, NotificationType.Warning);
			}
		}
	}
}
