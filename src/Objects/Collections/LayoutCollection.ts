import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { CadDictionary } from '../CadDictionary.js';
import { Layout } from '../Layout.js';

export class LayoutCollection extends ObjectDictionaryCollection<Layout> {
	constructor(dictionary: CadDictionary) {
		super(dictionary);
		this._dictionary = dictionary;
	}

	override remove(name: string): boolean {
		if (name.toLowerCase() === Layout.modelLayoutName.toLowerCase()
			|| name.toLowerCase() === Layout.paperLayoutName.toLowerCase()) {
			throw new Error(`The Layout ${name} cannot be removed.`);
		}
		return super.remove(name);
	}
}
