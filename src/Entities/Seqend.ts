import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { ObjectType } from '../Types/ObjectType.js';
import { CadObject } from '../CadObject.js';

export class Seqend extends Entity {
	override get objectType(): ObjectType {
		return ObjectType.SEQEND;
	}

	override get objectName(): string {
		return DxfFileToken.EntitySeqend;
	}

	constructor(owner?: CadObject) {
		super();
		if (owner) {
			this.owner = owner;
		}
	}

	override getBoundingBox(): any {
		return null;
	}

	override applyTransform(transform: any): void {
		// No-op
	}
}
