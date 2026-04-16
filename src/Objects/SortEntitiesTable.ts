import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CadObject } from '../CadObject.js';
import { Entity } from '../Entities/Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import type { BlockRecord } from '../Tables/BlockRecord.js';

export class Sorter {
	sortHandle: number = 0;
	entity: Entity;

	constructor(entity: Entity, handle: number) {
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
	blockOwner: BlockRecord | null = null;

	override get objectName(): string { return DxfFileToken.objectSortEntsTable; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get subclassMarker(): string { return DxfSubclassMarker.sortentsTable; }

	static readonly dictionaryEntryName = 'ACAD_SORTENTS';

	private _sorters: Sorter[] = [];

	constructor(owner?: BlockRecord) {
		super(SortEntitiesTable.dictionaryEntryName);
		if (owner) {
			this.blockOwner = owner;
		}
	}

	add(entity: Entity, sorterHandle: number): void {
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

	getSorterHandle(entity: Entity): number {
		const sorter = this._sorters.find(s => s.entity === entity);
		if (sorter) {
			return sorter.sortHandle;
		}
		return entity.handle;
	}

	remove(entity: Entity): boolean {
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
