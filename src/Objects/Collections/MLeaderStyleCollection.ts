import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { CadDictionary } from '../CadDictionary.js';
import { MultiLeaderStyle } from '../MultiLeaderStyle.js';

export class MLeaderStyleCollection extends ObjectDictionaryCollection<MultiLeaderStyle> {
	constructor(dictionary: CadDictionary) {
		super(dictionary);
	}

	createDefaults(): void {
		this._dictionary.tryAdd(MultiLeaderStyle.default_);
	}
}
