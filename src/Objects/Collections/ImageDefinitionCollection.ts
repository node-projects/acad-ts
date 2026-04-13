import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { CadDictionary } from '../CadDictionary.js';
import { ImageDefinition } from '../ImageDefinition.js';

export class ImageDefinitionCollection extends ObjectDictionaryCollection<ImageDefinition> {
	constructor(dictionary: CadDictionary) {
		super(dictionary);
	}
}
