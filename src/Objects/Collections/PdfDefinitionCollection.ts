import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { CadDictionary } from '../CadDictionary.js';
import { PdfUnderlayDefinition } from '../PdfUnderlayDefinition.js';

export class PdfDefinitionCollection extends ObjectDictionaryCollection<PdfUnderlayDefinition> {
	constructor(dictionary: CadDictionary) {
		super(dictionary);
	}
}
