import { CadObject } from '../../CadObject.js';
import { CadValue } from '../../CadValue.js';
import { CadValueType } from '../../CadValueType.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadValueTemplate implements ICadTemplate {
	CadValue: CadValue;

	ValueHandle: number | null = null;

	constructor(value: CadValue) {
		this.CadValue = value;
	}

	Build(builder: CadDocumentBuilder): void {
		const cadObject = builder.TryGetCadObject<CadObject>(this.ValueHandle);
		if (cadObject) {
			this.CadValue.setValue(cadObject, CadValueType.Handle);
		}
	}
}
