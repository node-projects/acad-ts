import { CadDictionary } from '../CadDictionary.js';
import { NonGraphicalObject } from '../NonGraphicalObject.js';
import { CollectionChangedEventArgs } from '../../CollectionChangedEventArgs.js';
import { CadObjectReferenceHandler } from '../../CadObjectReferenceHandler.js';
import { CadObject } from '../../CadObject.js';

export abstract class ObjectDictionaryCollection<T extends NonGraphicalObject> implements Iterable<T> {
	onAdd: ((sender: unknown, args: CollectionChangedEventArgs) => void) | null = null;
	onRemove: ((sender: unknown, args: CollectionChangedEventArgs) => void) | null = null;

	get handle(): number { return this._dictionary.handle; }
	get document() { return this._dictionary.document; }

	protected _dictionary: CadDictionary;
	private readonly _referenceHandler = new CadObjectReferenceHandler<string, T>();

	protected constructor(dictionary: CadDictionary) {
		if (!dictionary) {
			throw new Error('dictionary cannot be null');
		}
		this._dictionary = dictionary;
	}

	add(entry: T): void {
		this._dictionary.add(entry);
	}

	clear(): void {
		this._dictionary.clear();
	}

	containsKey(key: string): boolean {
		return this._dictionary.containsKey(key);
	}

	remove(name: string): boolean {
		const entry = this.tryGet(name);
		if (!this._dictionary.remove(name)) return false;
		if (entry) this._referenceHandler.assignAndRemove(name.toUpperCase(), this.getDefaultEntry());
		return true;
	}

	tryAdd(item: T): T {
		const existing = this.tryGet(item.name);
		if (existing) {
			return existing;
		}
		this.add(item);
		return item;
	}

	tryGet(name: string): T | null {
		return this._dictionary.getEntry<T>(name);
	}

	get(key: string): T | null {
		return this._dictionary.getEntry<T>(key);
	}

	getReferences(name: string): Iterable<CadObject> {
		return this._referenceHandler.getReferences(name.toUpperCase());
	}

	removeReference(name: string | null | undefined, owner: CadObject): void {
		if (!name) return;
		this._referenceHandler.removeReference(name.toUpperCase(), owner);
	}

	updateReference(owner: CadObject, entry: T, assignValue: (entry: T) => void): T {
		if (owner.document !== this.document) {
			throw new Error('The reference must belong to the same document as the collection.');
		}
		const existing = this.tryAdd(entry);
		this._referenceHandler.addReference(existing.name.toUpperCase(), owner, assignValue);
		assignValue(existing);
		return existing;
	}

	protected getDefaultEntry(): T {
		return null as T;
	}

	[Symbol.iterator](): Iterator<T> {
		const items: T[] = [];
		for (const item of this._dictionary) {
			items.push(item as T);
		}
		return items[Symbol.iterator]();
	}
}
