import { MultiLeaderStyle } from '../../Objects/MultiLeaderStyle.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { LineType } from '../../Tables/LineType.js';
import { TextStyle } from '../../Tables/TextStyle.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadMLeaderStyleTemplate extends CadTemplateT<MultiLeaderStyle> {
	arrowheadHandle: number | null = null;

	blockContentHandle: number | null = null;

	leaderLineTypeHandle: number | null = null;

	mTextStyleHandle: number | null = null;

	constructor(entry?: MultiLeaderStyle) {
		super(entry ?? new MultiLeaderStyle());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const lineType = builder.tryGetCadObject<LineType>(this.leaderLineTypeHandle);
		if (lineType) {
			this.cadObject.leaderLineType = lineType;
		}

		const arrowhead = builder.tryGetCadObject<BlockRecord>(this.arrowheadHandle);
		if (arrowhead) {
			this.cadObject.arrowhead = arrowhead;
		}

		const textStyle = builder.tryGetCadObject<TextStyle>(this.mTextStyleHandle);
		if (textStyle) {
			this.cadObject.textStyle = textStyle;
		}

		const blockContent = builder.tryGetCadObject<BlockRecord>(this.blockContentHandle);
		if (blockContent) {
			this.cadObject.blockContent = blockContent;
		}
	}
}
