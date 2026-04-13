import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { CadDictionary } from '../CadDictionary.js';
import { MLineStyle } from '../MLineStyle.js';

export class MLineStyleCollection extends ObjectDictionaryCollection<MLineStyle> {
	constructor(dictionary: CadDictionary) {
		super(dictionary);
	}

	createDefaults(): void {
		this._dictionary.tryAdd(MLineStyle.default_);
	}
}
