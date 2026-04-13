import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { CadDictionary } from '../CadDictionary.js';
import { Group } from '../Group.js';

export class GroupCollection extends ObjectDictionaryCollection<Group> {
	constructor(dictionary: CadDictionary) {
		super(dictionary);
		this._dictionary = dictionary;
	}

	override add(entry: Group): void {
		// TODO: validate entities belong to same document
		// TODO: handle unnamed groups with auto-naming
		super.add(entry);
	}

	createGroup(entities: any[], name: string = ''): Group {
		const group = new Group(name);
		this.add(group);
		// TODO: group.addRange(entities);
		return group;
	}
}
