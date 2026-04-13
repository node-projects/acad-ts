import { AttributeDefinition } from '../../Entities/AttributeDefinition.js';
import { MultiLeader , MultiLeaderBlockAttribute} from '../../Entities/MultiLeader.js';
import { MultiLeaderObjectContextData } from '../../Objects/MultiLeaderObjectContextData.js';
import { MultiLeaderStyle } from '../../Objects/MultiLeaderStyle.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { LineType } from '../../Tables/LineType.js';
import { TextStyle } from '../../Tables/TextStyle.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';
import { CadMLeaderAnnotContextTemplate } from './CadMLeaderAnnotContextTemplate.js';

export class CadMLeaderTemplate extends CadEntityTemplateT<MultiLeader> {
	ArrowheadHandle: number = 0;

	ArrowheadHandles: Map<number, boolean> = new Map();

	BlockAttributeHandles: Map<MultiLeaderBlockAttribute, number> = new Map();

	BlockContentHandle: number = 0;

	CadMLeaderAnnotContextTemplate: CadMLeaderAnnotContextTemplate;

	LeaderLineTypeHandle: number | null = null;

	LeaderStyleHandle: number = 0;

	MTextStyleHandle: number = 0;

	constructor(entity?: MultiLeader) {
		const e = entity ?? new MultiLeader();
		super(e);
		this.CadMLeaderAnnotContextTemplate = new CadMLeaderAnnotContextTemplate(e.contextData);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		this.CadMLeaderAnnotContextTemplate.Build(builder);

		const multiLeader = this.CadObject as MultiLeader;

		const leaderStyle = builder.TryGetCadObject<MultiLeaderStyle>(this.LeaderStyleHandle);
		if (leaderStyle) {
			multiLeader.style = leaderStyle;
		}
		const lineType = builder.TryGetCadObject<LineType>(this.LeaderLineTypeHandle);
		if (lineType) {
			multiLeader.leaderLineType = lineType;
		}
		const textStyle = builder.TryGetCadObject<TextStyle>(this.MTextStyleHandle);
		if (textStyle) {
			multiLeader.textStyle = textStyle;
		}
		const blockContent = builder.TryGetCadObject<BlockRecord>(this.BlockContentHandle);
		if (blockContent) {
			multiLeader.blockContentId = blockContent;
		}
		const arrowHead = builder.TryGetCadObject<BlockRecord>(this.ArrowheadHandle);
		if (arrowHead) {
			multiLeader.arrowhead = arrowHead;
		}

		//	TODO
		for (const [handle, value] of this.ArrowheadHandles) {
		}

		for (const blockAttribute of multiLeader.blockAttributes) {
			const attributeHandle = this.BlockAttributeHandles.get(blockAttribute);
			if (attributeHandle !== undefined) {
				const attributeDefinition = builder.TryGetCadObject<AttributeDefinition>(attributeHandle);
				if (attributeDefinition) {
					blockAttribute.attributeDefinition = attributeDefinition;
				}
			}
		}
	}
}
