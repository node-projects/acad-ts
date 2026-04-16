import { CadObject } from '../../CadObject.js';
import { CadValue } from '../../CadValue.js';
import { CadValueType } from '../../CadValueType.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadValueTemplate implements ICadTemplate {
	cadValue: CadValue;

	valueHandle: number | null = null;

	constructor(value: CadValue) {
		this.cadValue = value;
	}

	build(builder: CadDocumentBuilder): void {
		const cadObject = builder.tryGetCadObject<CadObject>(this.valueHandle);
		if (cadObject) {
			this.cadValue.setValue(cadObject, CadValueType.Handle);
		}
	}
}
