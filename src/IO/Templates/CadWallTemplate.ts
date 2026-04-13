import { Wall } from '../../Entities/AecObjects/Wall.js';
import { AecBinRecord } from '../../Objects/AEC/AecBinRecord.js';
import { AecWallStyle } from '../../Objects/AEC/AecWallStyle.js';
import { AecCleanupGroup } from '../../Objects/AEC/AecCleanupGroup.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadWallTemplate extends CadEntityTemplate {
	BinRecordHandle: number | null = null;

	CleanupGroupHandle: number | null = null;

	RawData: Uint8Array | null = null;

	StyleHandle: number | null = null;

	constructor(wall: Wall) {
		super(wall);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);
		const wall = this.CadObject as Wall;

		if (this.RawData !== null) {
			wall.rawData = this.RawData;
		}

		const binRecord = builder.TryGetCadObject<AecBinRecord>(this.BinRecordHandle);
		if (binRecord) {
			wall.binRecord = binRecord;
		}

		const wallStyle = builder.TryGetCadObject<AecWallStyle>(this.StyleHandle);
		if (wallStyle) {
			wall.style = wallStyle;
		}

		const cleanupGroup = builder.TryGetCadObject<AecCleanupGroup>(this.CleanupGroupHandle);
		if (cleanupGroup) {
			wall.cleanupGroup = cleanupGroup;
		}
	}
}
