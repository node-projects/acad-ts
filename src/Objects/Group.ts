import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CadObject } from '../CadObject.js';
import { Entity } from '../Entities/Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class Group extends NonGraphicalObject {
	description: string = '';

	get entities(): readonly Entity[] { return this._entities; }

	get isUnnamed(): boolean {
		return !this.name || this.name.startsWith('*');
	}

	override get objectName(): string {
		return DxfFileToken.tableGroup;
	}

	override get objectType(): ObjectType {
		return ObjectType.GROUP;
	}

	selectable: boolean = true;

	override get subclassMarker(): string {
		return DxfSubclassMarker.group;
	}

	private _entities: Entity[] = [];

	constructor(name?: string) {
		super(name);
	}

	add(entity: Entity): void {
		if (this.document !== entity.document) {
			throw new Error('The Group and the entity must belong to the same document.');
		}
		this._entities.push(entity);
		entity.addReactor(this);
	}

	addRange(entities: Entity[]): void {
		for (const e of entities) {
			this.add(e);
		}
	}

	clear(): void {
		for (const e of this._entities) {
			e.removeReactor(this);
		}
		this._entities = [];
	}

	remove(entity: Entity): boolean {
		entity.removeReactor(this);
		const idx = this._entities.indexOf(entity);
		if (idx >= 0) {
			this._entities.splice(idx, 1);
			return true;
		}
		return false;
	}

	override clone(): CadObject {
		const clone = super.clone() as Group;
		clone._entities = [];
		return clone;
	}
}
