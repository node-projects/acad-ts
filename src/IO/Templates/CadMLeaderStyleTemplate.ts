import { MultiLeaderStyle } from '../../Objects/MultiLeaderStyle.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { LineType } from '../../Tables/LineType.js';
import { TextStyle } from '../../Tables/TextStyle.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadMLeaderStyleTemplate extends CadTemplateT<MultiLeaderStyle> {
	ArrowheadHandle: number | null = null;

	BlockContentHandle: number | null = null;

	LeaderLineTypeHandle: number | null = null;

	MTextStyleHandle: number | null = null;

	constructor(entry?: MultiLeaderStyle) {
		super(entry ?? new MultiLeaderStyle());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const lineType = builder.TryGetCadObject<LineType>(this.LeaderLineTypeHandle);
		if (lineType) {
			this.CadObject.leaderLineType = lineType;
		}

		const arrowhead = builder.TryGetCadObject<BlockRecord>(this.ArrowheadHandle);
		if (arrowhead) {
			this.CadObject.arrowhead = arrowhead;
		}

		const textStyle = builder.TryGetCadObject<TextStyle>(this.MTextStyleHandle);
		if (textStyle) {
			this.CadObject.textStyle = textStyle;
		}

		const blockContent = builder.TryGetCadObject<BlockRecord>(this.BlockContentHandle);
		if (blockContent) {
			this.CadObject.blockContent = blockContent;
		}
	}
}
