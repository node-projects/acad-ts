import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import type { BlockRecord } from '../Tables/BlockRecord.js';

export class BlockRepresentationData extends NonGraphicalObject {
	block: BlockRecord | null = null;

	override get objectName(): string {
		return DxfFileToken.objectBlockRepresentationData;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.blockRepresentationData;
	}

	value70: number = 0;
}
