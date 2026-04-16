import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { CadObject } from '../CadObject.js';
import { Entity } from '../Entities/Entity.js';
import type { BoundingBox } from '../Math/BoundingBox.js';
import { BlockRecord } from '../Tables/BlockRecord.js';

export class BlockEnd extends Entity {
	public override get objectName(): string {
		return DxfFileToken.endBlock;
	}

	public override get objectType(): ObjectType {
		return ObjectType.ENDBLK;
	}

	public override get subclassMarker(): string {
		return DxfSubclassMarker.blockEnd;
	}

	public constructor(record?: BlockRecord) {
		super();
		if (record) {
			this.owner = record;
		}
	}

	public override clone(): CadObject {
		const clone = super.clone() as BlockEnd;
		const owner = this.owner as BlockRecord | null;
		if (owner != null) {
			const cloneOwner = new BlockRecord(owner.name);
			cloneOwner.blockEnd = clone;
		}
		return clone;
	}

	public override applyTransform(transform: unknown): void {
		// Nothing to transform for block end markers
	}

	public override getBoundingBox(): BoundingBox | null {
		return null;
	}
}
