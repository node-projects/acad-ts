import { CadObject } from '../../CadObject.js';
import { CadDictionaryWithDefault } from '../../Objects/CadDictionaryWithDefault.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadDictionaryTemplate } from './CadDictionaryTemplate.js';

export class CadDictionaryWithDefaultTemplate extends CadDictionaryTemplate {
	defaultEntryHandle: number | null = null;

	constructor(dictionary?: CadDictionaryWithDefault) {
		super(dictionary ?? new CadDictionaryWithDefault());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const entry = builder.tryGetCadObject<CadObject>(this.defaultEntryHandle);
		if (entry) {
			(this.cadObject as CadDictionaryWithDefault).defaultEntry = entry;
		}
	}
}
