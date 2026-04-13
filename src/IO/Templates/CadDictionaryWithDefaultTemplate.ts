import { CadObject } from '../../CadObject.js';
import { CadDictionaryWithDefault } from '../../Objects/CadDictionaryWithDefault.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadDictionaryTemplate } from './CadDictionaryTemplate.js';

export class CadDictionaryWithDefaultTemplate extends CadDictionaryTemplate {
	DefaultEntryHandle: number | null = null;

	constructor(dictionary?: CadDictionaryWithDefault) {
		super(dictionary ?? new CadDictionaryWithDefault());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const entry = builder.TryGetCadObject<CadObject>(this.DefaultEntryHandle);
		if (entry) {
			(this.CadObject as CadDictionaryWithDefault).defaultEntry = entry;
		}
	}
}
