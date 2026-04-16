import { Field } from '../../Objects/Field.js';
import { FieldList } from '../../Objects/FieldList.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
import { ICadOwnerTemplate } from './ICadOwnerTemplate.js';

export class CadFieldListTemplate extends CadTemplateT<FieldList> implements ICadOwnerTemplate {
	ownedObjectsHandlers: Set<number> = new Set();

	constructor(obj: FieldList) {
		super(obj);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		for (const handle of this.ownedObjectsHandlers) {
			const field = builder.tryGetCadObject<Field>(handle);
			if (field) {
				this.cadObject.fields.push(field);
			} else {
				builder.notify(`Field ${handle} not found for FieldList ${this.cadObject.handle}`, NotificationType.Warning);
			}
		}
	}
}
