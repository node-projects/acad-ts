import { Entity } from '../../Entities/Entity.js';

export class StretchEntityBind {
	entity: Entity | null;
	pointIndexes: number[];

	constructor(entity: Entity | null = null, pointIndexes: number[] = []) {
		this.entity = entity;
		this.pointIndexes = pointIndexes;
	}
}
