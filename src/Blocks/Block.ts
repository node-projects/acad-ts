import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { BlockTypeFlags } from './BlockTypeFlags.js';
import { Entity } from '../Entities/Entity.js';
import { CadObject } from '../CadObject.js';
import { XYZ } from '../Math/XYZ.js';

export const XYZ_Zero: XYZ = new XYZ(0, 0, 0);

export class Block extends Entity {
	public basePoint: XYZ = XYZ_Zero;

	public get blockOwner(): any /* BlockRecord */ {
		return this.owner;
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
		return DxfFileToken.Block;
	}

	public override get objectType(): ObjectType {
		return ObjectType.BLOCK;
	}

	public override get subclassMarker(): string {
		return DxfSubclassMarker.BlockBegin;
	}

	public xRefPath: string | null = null;

	public constructor(record?: any /* BlockRecord */) {
		super();
		if (record) {
			this.owner = record;
		}
	}

	public override clone(): CadObject {
		const clone = super.clone() as Block;
		// TODO: clone.owner = new BlockRecord(this.name);
		return clone;
	}

	public override applyTransform(transform: any): void {
		// TODO: apply block transform when block geometry support is implemented
	}

	public override getBoundingBox(): any {
		return null;
	}
}
