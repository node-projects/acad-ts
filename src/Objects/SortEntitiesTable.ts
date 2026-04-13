import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class Sorter {
	sortHandle: number = 0;
	entity: any = null;

	constructor(entity: any, handle: number) {
		this.entity = entity;
		this.sortHandle = handle;
	}

	toString(): string {
		return `${this.sortHandle} | ${this.entity?.toString()}`;
	}

	compareTo(other: Sorter): number {
		if (this.sortHandle < other.sortHandle) return -1;
		if (this.sortHandle > other.sortHandle) return 1;
		return 0;
	}
}

export class SortEntitiesTable extends NonGraphicalObject implements Iterable<Sorter> {
	blockOwner: any = null;

	override get objectName(): string { return DxfFileToken.ObjectSortEntsTable; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get subclassMarker(): string { return DxfSubclassMarker.SortentsTable; }

	static readonly DictionaryEntryName = 'ACAD_SORTENTS';

	private _sorters: Sorter[] = [];

	constructor(owner?: any) {
		super(SortEntitiesTable.DictionaryEntryName);
		if (owner) {
			this.blockOwner = owner;
		}
	}

	add(entity: any, sorterHandle: number): void {
		this._sorters.push(new Sorter(entity, sorterHandle));
	}

	clear(): void {
		this._sorters.length = 0;
	}

	override clone(): CadObject {
		const clone = super.clone() as SortEntitiesTable;
		clone._sorters = [];
		return clone;
	}

	getSorterHandle(entity: any): number {
		const sorter = this._sorters.find(s => s.entity === entity);
		if (sorter) {
			return sorter.sortHandle;
		}
		return entity.handle;
	}

	remove(entity: any): boolean {
		const idx = this._sorters.findIndex(s => s.entity === entity);
		if (idx < 0) return false;
		this._sorters.splice(idx, 1);
		return true;
	}

	[Symbol.iterator](): Iterator<Sorter> {
		const sorted = [...this._sorters].sort((a, b) => a.compareTo(b));
		return sorted[Symbol.iterator]();
	}
}
