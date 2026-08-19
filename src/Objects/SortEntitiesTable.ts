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

	moveToBottom(entity: Entity): void {
		const maxHandle = this._sorters.length > 0
			? Math.max(...this._sorters.map(sorter => sorter.sortHandle))
			: entity.handle;
		this._setSorterHandle(entity, Math.min(Number.MAX_SAFE_INTEGER, maxHandle + 1));
	}

	moveToTop(entity: Entity): void {
		const minHandle = this._sorters.length > 0
			? Math.min(...this._sorters.map(sorter => sorter.sortHandle))
			: entity.handle;
		this._setSorterHandle(entity, Math.max(0, minHandle - 1));
	}

	oneStepUp(entity: Entity): void {
		const sorted = [...this._sorters].sort((a, b) => a.compareTo(b));
		const index = sorted.findIndex(sorter => sorter.entity === entity);
		if (index <= 0) return;
		const previous = sorted[index - 1];
		const current = sorted[index];
		[current.sortHandle, previous.sortHandle] = [previous.sortHandle, current.sortHandle];
	}

	oneStepDown(entity: Entity): void {
		const sorted = [...this._sorters].sort((a, b) => a.compareTo(b));
		const index = sorted.findIndex(sorter => sorter.entity === entity);
		if (index < 0 || index >= sorted.length - 1) return;
		const current = sorted[index];
		const next = sorted[index + 1];
		[current.sortHandle, next.sortHandle] = [next.sortHandle, current.sortHandle];
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

	private _setSorterHandle(entity: Entity, handle: number): void {
		const sorter = this._sorters.find(item => item.entity === entity);
		if (sorter) {
			sorter.sortHandle = handle;
		} else {
			this._sorters.push(new Sorter(entity, handle));
		}
	}
}
