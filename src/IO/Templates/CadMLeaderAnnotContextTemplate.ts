import { BlockRecord } from '../../Tables/BlockRecord.js';
import { LeaderLine, MultiLeaderObjectContextData } from '../../Objects/MultiLeaderObjectContextData.js';
import { LineType } from '../../Tables/LineType.js';
import { TextStyle } from '../../Tables/TextStyle.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadAnnotScaleObjectContextDataTemplate } from './CadAnnotScaleObjectContextDataTemplate.js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadMLeaderAnnotContextTemplate extends CadAnnotScaleObjectContextDataTemplate {
	BlockRecordHandle: number = 0;

	leaderLineTemplates: CadMLeaderAnnotContextTemplate.LeaderLineTemplate[] = [];

	TextStyleHandle: number = 0;

	constructor(cadObject: MultiLeaderObjectContextData) {
		super(cadObject);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);
		const annotContext = this.CadObject as MultiLeaderObjectContextData;

		const annotContextTextStyle = builder.TryGetCadObject<TextStyle>(this.TextStyleHandle);
		if (annotContextTextStyle) {
			annotContext.textStyle = annotContextTextStyle;
		}
		const annotContextBlockRecord = builder.TryGetCadObject<BlockRecord>(this.BlockRecordHandle);
		if (annotContextBlockRecord) {
			annotContext.blockContent = annotContextBlockRecord;
		}

		for (const leaderLineSubTemplate of this.leaderLineTemplates) {
			leaderLineSubTemplate.Build(builder);
		}
	}
}

export namespace CadMLeaderAnnotContextTemplate {
	export class LeaderLineTemplate implements ICadTemplate {
		ArrowSymbolHandle: number | null = null;

		LeaderLine: LeaderLine;

		LineTypeHandle: number | null = null;

		constructor(leaderLine?: LeaderLine) {
			this.LeaderLine = leaderLine ?? new LeaderLine();
		}

		Build(builder: CadDocumentBuilder): void {
			const leaderLinelineType = builder.TryGetCadObject<LineType>(this.LineTypeHandle);
			if (leaderLinelineType) {
				this.LeaderLine.lineType = leaderLinelineType;
			}
			const arrowhead = builder.TryGetCadObject<BlockRecord>(this.ArrowSymbolHandle);
			if (arrowhead) {
				this.LeaderLine.arrowhead = arrowhead;
			}
		}
	}
}
