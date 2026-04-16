import { BlockRecord } from '../../Tables/BlockRecord.js';
import { LeaderLine, MultiLeaderObjectContextData } from '../../Objects/MultiLeaderObjectContextData.js';
import { LineType } from '../../Tables/LineType.js';
import { TextStyle } from '../../Tables/TextStyle.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadAnnotScaleObjectContextDataTemplate } from './CadAnnotScaleObjectContextDataTemplate.js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadMLeaderAnnotContextTemplate extends CadAnnotScaleObjectContextDataTemplate {
	blockRecordHandle: number = 0;

	leaderLineTemplates: CadMLeaderAnnotContextTemplate.LeaderLineTemplate[] = [];

	textStyleHandle: number = 0;

	constructor(cadObject: MultiLeaderObjectContextData) {
		super(cadObject);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);
		const annotContext = this.cadObject as MultiLeaderObjectContextData;

		const annotContextTextStyle = builder.tryGetCadObject<TextStyle>(this.textStyleHandle);
		if (annotContextTextStyle) {
			annotContext.textStyle = annotContextTextStyle;
		}
		const annotContextBlockRecord = builder.tryGetCadObject<BlockRecord>(this.blockRecordHandle);
		if (annotContextBlockRecord) {
			annotContext.blockContent = annotContextBlockRecord;
		}

		for (const leaderLineSubTemplate of this.leaderLineTemplates) {
			leaderLineSubTemplate.build(builder);
		}
	}
}

export namespace CadMLeaderAnnotContextTemplate {
	export class LeaderLineTemplate implements ICadTemplate {
		arrowSymbolHandle: number | null = null;

		leaderLine: LeaderLine;

		lineTypeHandle: number | null = null;

		constructor(leaderLine?: LeaderLine) {
			this.leaderLine = leaderLine ?? new LeaderLine();
		}

		build(builder: CadDocumentBuilder): void {
			const leaderLinelineType = builder.tryGetCadObject<LineType>(this.lineTypeHandle);
			if (leaderLinelineType) {
				this.leaderLine.lineType = leaderLinelineType;
			}
			const arrowhead = builder.tryGetCadObject<BlockRecord>(this.arrowSymbolHandle);
			if (arrowhead) {
				this.leaderLine.arrowhead = arrowhead;
			}
		}
	}
}
