import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { ObjectType } from '../Types/ObjectType.js';
import { CadObject } from '../CadObject.js';
import type { BoundingBox } from '../Math/BoundingBox.js';

export class Seqend extends Entity {
	override get objectType(): ObjectType {
		return ObjectType.SEQEND;
	}

	override get objectName(): string {
		return DxfFileToken.entitySeqend;
	}

	constructor(owner?: CadObject) {
		super();
		if (owner) {
			this.owner = owner;
		}
	}

	override getBoundingBox(): BoundingBox | null {
		return null;
	}

	override applyTransform(transform: unknown): void {
		// No-op
	}
}
