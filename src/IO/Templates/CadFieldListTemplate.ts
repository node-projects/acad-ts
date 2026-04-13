import { Field } from '../../Objects/Field.js';
import { FieldList } from '../../Objects/FieldList.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
import { ICadOwnerTemplate } from './ICadOwnerTemplate.js';

export class CadFieldListTemplate extends CadTemplateT<FieldList> implements ICadOwnerTemplate {
	OwnedObjectsHandlers: Set<number> = new Set();

	constructor(obj: FieldList) {
		super(obj);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		for (const handle of this.OwnedObjectsHandlers) {
			const field = builder.TryGetCadObject<Field>(handle);
			if (field) {
				this.CadObject.fields.push(field);
			} else {
				builder.Notify(`Field ${handle} not found for FieldList ${this.CadObject.handle}`, NotificationType.Warning);
			}
		}
	}
}
