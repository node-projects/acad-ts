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
	arrowheadHandle: number = 0;

	arrowheadHandles: Map<number, boolean> = new Map();

	blockAttributeHandles: Map<MultiLeaderBlockAttribute, number> = new Map();

	blockContentHandle: number = 0;

	cadMLeaderAnnotContextTemplate: CadMLeaderAnnotContextTemplate;

	leaderLineTypeHandle: number | null = null;

	leaderStyleHandle: number = 0;

	mTextStyleHandle: number = 0;

	constructor(entity?: MultiLeader) {
		const e = entity ?? new MultiLeader();
		super(e);
		this.cadMLeaderAnnotContextTemplate = new CadMLeaderAnnotContextTemplate(e.contextData);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		this.cadMLeaderAnnotContextTemplate.build(builder);

		const multiLeader = this.cadObject as MultiLeader;

		const leaderStyle = builder.tryGetCadObject<MultiLeaderStyle>(this.leaderStyleHandle);
		if (leaderStyle) {
			multiLeader.style = leaderStyle;
		}
		const lineType = builder.tryGetCadObject<LineType>(this.leaderLineTypeHandle);
		if (lineType) {
			multiLeader.leaderLineType = lineType;
		}
		const textStyle = builder.tryGetCadObject<TextStyle>(this.mTextStyleHandle);
		if (textStyle) {
			multiLeader.textStyle = textStyle;
		}
		const blockContent = builder.tryGetCadObject<BlockRecord>(this.blockContentHandle);
		if (blockContent) {
			multiLeader.blockContentId = blockContent;
		}
		const arrowHead = builder.tryGetCadObject<BlockRecord>(this.arrowheadHandle);
		if (arrowHead) {
			multiLeader.arrowhead = arrowHead;
		}

		const leaderLines = multiLeader.contextData.leaderRoots.flatMap((root) => root.lines);
		for (const [handle, isDefault] of this.arrowheadHandles) {
			const arrowhead = builder.tryGetCadObject<BlockRecord>(handle);
			if (arrowhead == null) {
				continue;
			}

			if (isDefault) {
				multiLeader.arrowhead ??= arrowhead;
				continue;
			}

			const leaderLine = leaderLines.find((line) => line.arrowhead == null);
			if (leaderLine != null) {
				leaderLine.arrowhead = arrowhead;
			} else {
				multiLeader.arrowhead ??= arrowhead;
			}
		}

		for (const blockAttribute of multiLeader.blockAttributes) {
			const attributeHandle = this.blockAttributeHandles.get(blockAttribute);
			if (attributeHandle !== undefined) {
				const attributeDefinition = builder.tryGetCadObject<AttributeDefinition>(attributeHandle);
				if (attributeDefinition) {
					blockAttribute.attributeDefinition = attributeDefinition;
				}
			}
		}
	}
}
