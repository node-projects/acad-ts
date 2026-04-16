import { ObjectDictionaryCollection } from './ObjectDictionaryCollection.js';
import { CadDictionary } from '../CadDictionary.js';
import { Group } from '../Group.js';
import { Entity } from '../../Entities/Entity.js';

export class GroupCollection extends ObjectDictionaryCollection<Group> {
	constructor(dictionary: CadDictionary) {
		super(dictionary);
		this._dictionary = dictionary;
	}

	override add(entry: Group): void {
		if (!entry.name || !entry.name.trim()) {
			entry.name = this._createName('*A');
		}

		this._validateEntities(entry.entities);
		super.add(entry);
	}

	createGroup(entities: Entity[], name: string = ''): Group {
		this._validateEntities(entities);

		const group = new Group(name);
		this.add(group);
		group.addRange(entities);
		return group;
	}

	private _createName(prefix: string): string {
		let index = 0;
		while (this.containsKey(`${prefix}${index}`)) {
			index++;
		}
		return `${prefix}${index}`;
	}

	private _validateEntities(entities: readonly Entity[]): void {
		const document = this._dictionary.document;
		if (document == null) {
			return;
		}

		for (const entity of entities) {
			if (entity.document !== document) {
				throw new Error('All group entities must belong to the same document as the group collection.');
			}
		}
	}
}
