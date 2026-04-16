import { CadObject } from '../../CadObject.js';
import { Field } from '../../Objects/Field.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadFieldTemplate extends CadTemplateT<Field> {
	cadObjectsHandles: number[] = [];

	cadValueTemplates: ICadTemplate[] = [];

	childrenHandles: number[] = [];

	constructor(obj: Field) {
		super(obj);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		for (const handle of this.cadObjectsHandles) {
			const cobject = builder.tryGetCadObject<CadObject>(handle);
			if (cobject) {
				this.cadObject.cadObjects.push(cobject);
			} else {
				builder.notify(`[${this.cadObject.subclassMarker}] CadObject with handle ${handle} not found.`, NotificationType.Warning);
			}
		}

		for (const handle of this.childrenHandles) {
			const f = builder.tryGetCadObject<Field>(handle);
			if (f) {
				this.cadObject.children.push(f);
			} else {
				builder.notify(`[${this.cadObject.subclassMarker}] CadObject with handle ${handle} not found.`, NotificationType.Warning);
			}
		}
	}
}
