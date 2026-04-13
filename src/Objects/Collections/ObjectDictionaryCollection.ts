import { CadDictionary } from '../CadDictionary.js';
import { NonGraphicalObject } from '../NonGraphicalObject.js';
import { CollectionChangedEventArgs } from '../../CollectionChangedEventArgs.js';

export abstract class ObjectDictionaryCollection<T extends NonGraphicalObject> implements Iterable<T> {
	onAdd: ((sender: any, args: CollectionChangedEventArgs) => void) | null = null;
	onRemove: ((sender: any, args: CollectionChangedEventArgs) => void) | null = null;

	get handle(): number { return this._dictionary.handle; }

	protected _dictionary: CadDictionary;

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
		return this._dictionary.remove(name);
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

	[Symbol.iterator](): Iterator<T> {
		const items: T[] = [];
		for (const item of this._dictionary) {
			items.push(item as T);
		}
		return items[Symbol.iterator]();
	}
}
