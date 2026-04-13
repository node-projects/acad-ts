import { CadObject } from '../../CadObject.js';
import { CollectionChangedEventArgs } from '../../CollectionChangedEventArgs.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { OnNameChangedArgs } from '../../OnNameChangedArgs.js';
import { TableEntry } from '../TableEntry.js';
import { ITable } from './ITable.js';

export abstract class Table<T extends TableEntry> extends CadObject implements ITable, Iterable<T> {
	public onAdd: ((sender: any, args: CollectionChangedEventArgs) => void) | null = null;
	public onRemove: ((sender: any, args: CollectionChangedEventArgs) => void) | null = null;

	public get count(): number {
		return this.entries.size;
	}

	public override get objectName(): string {
		return DxfFileToken.TableEntry;
	}

	public override get subclassMarker(): string {
		return DxfSubclassMarker.Table;
	}

	protected abstract get defaultEntries(): string[];

	protected entries: Map<string, T> = new Map<string, T>();

	protected constructor() {
		super();
	}

	public add(item: T): void {
		if (!item.name || !item.name.trim()) {
			item.name = this.createName('unnamed');
		}
		this.addEntry(item.name, item);
	}

	public addRange(items: Iterable<T>): void {
		for (const item of items) {
			this.add(item);
		}
	}

	public tryAdd(item: T): T {
		const existing = this.tryGetValue(item.name);
		if (existing !== undefined) {
			return existing;
		} else {
			this.add(item);
			return item;
		}
	}

	public contains(key: string): boolean {
		return this.entries.has(key.toUpperCase());
	}

	public createDefaultEntries(): void {
		for (const entry of this.defaultEntries) {
			if (this.contains(entry)) continue;
			// TODO: Activator.CreateInstance equivalent - subclasses should override
		}
	}

	public [Symbol.iterator](): Iterator<T> {
		return this.entries.values()[Symbol.iterator]();
	}

	public remove(key: string): T | null {
		if (this.defaultEntries.some(d => d.toUpperCase() === key.toUpperCase())) {
			return null;
		}

		const upperKey = key.toUpperCase();
		const item = this.entries.get(upperKey);
		if (item) {
			this.entries.delete(upperKey);
			item.owner = null;
			this.onRemove?.(this, new CollectionChangedEventArgs(item));
			item.onNameChanged = null;
			return item;
		}

		return null;
	}

	public tryGetValue(key: string): T | undefined {
		return this.entries.get(key.toUpperCase());
	}

	protected addEntry(key: string, item: T): void {
		this.entries.set(key.toUpperCase(), item);
		item.owner = this;

		item.onNameChanged = (sender: any, e: OnNameChangedArgs) => {
			this.onEntryNameChanged(sender, e);
		};

		this.onAdd?.(this, new CollectionChangedEventArgs(item));
	}

	protected addHandlePrefix(item: T): void {
		item.owner = this;
		item.onNameChanged = (sender: any, e: OnNameChangedArgs) => {
			this.onEntryNameChanged(sender, e);
		};

		this.onAdd?.(this, new CollectionChangedEventArgs(item));

		const key = `${item.handle}:${item.name}`;
		this.entries.set(key.toUpperCase(), item);
	}

	protected createName(prefix: string): string {
		let i = 0;
		while (this.entries.has(`${prefix}${i}`.toUpperCase())) {
			i++;
		}
		return `${prefix}${i}`;
	}

	private onEntryNameChanged(sender: any, e: OnNameChangedArgs): void {
		if (this.defaultEntries.some(d => d.toUpperCase() === e.oldName.toUpperCase())) {
			throw new Error(`The name ${e.oldName} belongs to a default entry.`);
		}

		const entry = this.entries.get(e.oldName.toUpperCase());
		if (entry) {
			this.entries.set(e.newName.toUpperCase(), entry);
			this.entries.delete(e.oldName.toUpperCase());
		}
	}

	public get(name: string): T {
		const entry = this.entries.get(name.toUpperCase());
		if (entry === undefined) {
			throw new Error(`Entry '${name}' not found in table.`);
		}
		return entry;
	}
}
