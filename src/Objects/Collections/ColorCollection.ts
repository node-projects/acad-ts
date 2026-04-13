import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { CadDictionary } from '../CadDictionary.js';
import { BookColor } from '../BookColor.js';

export class ColorCollection extends ObjectDictionaryCollection<BookColor> {
	constructor(dictionary: CadDictionary) {
		super(dictionary);
	}
}
