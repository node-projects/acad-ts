import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { CadDictionary } from '../CadDictionary.js';
import { Material } from '../Material.js';

export class MaterialCollection extends ObjectDictionaryCollection<Material> {
	constructor(dictionary: CadDictionary) {
		super(dictionary);
	}

	createDefaults(): void {
		this._dictionary.tryAdd(new Material('Global'));
		this._dictionary.tryAdd(new Material('ByLayer'));
		this._dictionary.tryAdd(new Material('ByBlock'));
	}
}
