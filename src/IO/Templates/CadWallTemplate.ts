import { Wall } from '../../Entities/AecObjects/Wall.js';
import { AecBinRecord } from '../../Objects/AEC/AecBinRecord.js';
import { AecWallStyle } from '../../Objects/AEC/AecWallStyle.js';
import { AecCleanupGroup } from '../../Objects/AEC/AecCleanupGroup.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadWallTemplate extends CadEntityTemplate {
	binRecordHandle: number | null = null;

	cleanupGroupHandle: number | null = null;

	rawData: Uint8Array | null = null;

	styleHandle: number | null = null;

	constructor(wall: Wall) {
		super(wall);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);
		const wall = this.cadObject as Wall;

		if (this.rawData !== null) {
			wall.rawData = this.rawData;
		}

		const binRecord = builder.tryGetCadObject<AecBinRecord>(this.binRecordHandle);
		if (binRecord) {
			wall.binRecord = binRecord;
		}

		const wallStyle = builder.tryGetCadObject<AecWallStyle>(this.styleHandle);
		if (wallStyle) {
			wall.style = wallStyle;
		}

		const cleanupGroup = builder.tryGetCadObject<AecCleanupGroup>(this.cleanupGroupHandle);
		if (cleanupGroup) {
			wall.cleanupGroup = cleanupGroup;
		}
	}
}
