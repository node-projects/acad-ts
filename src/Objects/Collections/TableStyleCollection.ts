import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { CadDictionary } from '../CadDictionary.js';
import { TableStyle } from '../TableStyle.js';

export class TableStyleCollection extends ObjectDictionaryCollection<TableStyle> {
	constructor(dictionary: CadDictionary) {
		super(dictionary);
	}

	createDefaults(): void {
		this._dictionary.tryAdd(TableStyle.default_);
	}
}
