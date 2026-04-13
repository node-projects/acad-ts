import { CadObject } from '../../CadObject.js';
import { Field } from '../../Objects/Field.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadFieldTemplate extends CadTemplateT<Field> {
	CadObjectsHandles: number[] = [];

	CadValueTemplates: ICadTemplate[] = [];

	ChildrenHandles: number[] = [];

	constructor(obj: Field) {
		super(obj);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		for (const handle of this.CadObjectsHandles) {
			const cobject = builder.TryGetCadObject<CadObject>(handle);
			if (cobject) {
				this.CadObject.cadObjects.push(cobject);
			} else {
				builder.Notify(`[${this.CadObject.subclassMarker}] CadObject with handle ${handle} not found.`, NotificationType.Warning);
			}
		}

		for (const handle of this.ChildrenHandles) {
			const f = builder.TryGetCadObject<Field>(handle);
			if (f) {
				this.CadObject.children.push(f);
			} else {
				builder.Notify(`[${this.CadObject.subclassMarker}] CadObject with handle ${handle} not found.`, NotificationType.Warning);
			}
		}
	}
}
