import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { BlockTypeFlags } from './BlockTypeFlags.js';
import type { BoundingBox } from '../Math/BoundingBox.js';
import { Entity } from '../Entities/Entity.js';
import { CadObject } from '../CadObject.js';
import { XYZ } from '../Math/XYZ.js';
import { BlockRecord } from '../Tables/BlockRecord.js';

export const XYZ_Zero: XYZ = new XYZ(0, 0, 0);

export class Block extends Entity {
	public basePoint: XYZ = XYZ_Zero;

	public get blockOwner(): BlockRecord | null {
		return this.owner as BlockRecord | null;
	}

	public comments: string | null = null;

	public flags: BlockTypeFlags = BlockTypeFlags.None;

	public isUnloaded: boolean = false;

	public get name(): string {
		return this.blockOwner?.name ?? '';
	}
	public set name(value: string) {
		if (this.blockOwner) {
			this.blockOwner.name = value;
		}
	}

	public override get objectName(): string {
		return DxfFileToken.block;
	}

	public override get objectType(): ObjectType {
		return ObjectType.BLOCK;
	}

	public override get subclassMarker(): string {
		return DxfSubclassMarker.blockBegin;
	}

	public xRefPath: string | null = null;

	public constructor(record?: BlockRecord) {
		super();
		if (record) {
			this.owner = record;
		}
	}

	public override clone(): CadObject {
		const clone = super.clone() as Block;
		if (this.blockOwner != null) {
			const owner = new BlockRecord(this.blockOwner.name);
			owner.blockEntity = clone;
		}
		return clone;
	}

	public override applyTransform(transform: unknown): void {
		this.basePoint = this.applyTransformToPoint(transform, this.basePoint);
	}

	public override getBoundingBox(): BoundingBox | null {
		return null;
	}
}
