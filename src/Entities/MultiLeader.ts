import { Entity } from './Entity.js';
import { AttributeDefinition } from './AttributeDefinition.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { Color } from '../Color.js';
import { LeaderContentType } from '../Objects/LeaderContentType.js';
import { MultiLeaderPathType } from '../MultiLeaderPathType.js';
import { MultiLeaderPropertyOverrideFlags } from './MultiLeaderPropertyOverrideFlags.js';
import { TextAlignmentType } from '../TextAlignmentType.js';
import { TextAttachmentDirectionType } from '../TextAttachmentDirectionType.js';
import { TextAttachmentPointType } from '../TextAttachmentPoint.js';
import { TextAttachmentType } from '../TextAttachmentType.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
import { LeaderLine, LeaderRoot, MultiLeaderObjectContextData, StartEndPointPair } from '../Objects/MultiLeaderObjectContextData.js';
import { MultiLeaderStyle } from '../Objects/MultiLeaderStyle.js';
import { BlockRecord } from '../Tables/BlockRecord.js';
import { LineType } from '../Tables/LineType.js';
import { TextStyle } from '../Tables/TextStyle.js';

export class MultiLeaderBlockAttribute {
	attributeDefinition: AttributeDefinition | null = null;
	index: number = 0;
	width: number = 0;
	text: string = '';

	clone(): MultiLeaderBlockAttribute {
		const c = new MultiLeaderBlockAttribute();
		c.attributeDefinition = this.attributeDefinition;
		c.index = this.index;
		c.width = this.width;
		c.text = this.text;
		return c;
	}
}

export class MultiLeader extends Entity {
	arrowhead: BlockRecord | null = null;

	arrowheadSize: number = 0;

	blockAttributes: MultiLeaderBlockAttribute[] = [];

	blockContentColor: Color = Color.ByBlock;

	blockContentConnection: number = 0;

	blockContentId: BlockRecord | null = null;

	blockContentRotation: number = 0;

	blockContentScale: XYZ = new XYZ(1, 1, 1);

	contentType: LeaderContentType = LeaderContentType.MText;

	contextData: MultiLeaderObjectContextData = new MultiLeaderObjectContextData();

	enableAnnotationScale: boolean = false;

	enableDogleg: boolean = true;

	enableLanding: boolean = true;

	extendedToText: boolean = false;

	landingDistance: number = 0;

	leaderLineType: LineType | null = null;

	leaderLineWeight: number = 0;

	lineColor: Color = Color.ByBlock;

	override get objectName(): string {
		return DxfFileToken.EntityMultiLeader;
	}

	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	pathType: MultiLeaderPathType = MultiLeaderPathType.StraightLineSegments;

	propertyOverrideFlags: MultiLeaderPropertyOverrideFlags = 0;

	scaleFactor: number = 1.0;

	style: MultiLeaderStyle | null = null;

	override get subclassMarker(): string {
		return DxfSubclassMarker.MultiLeader;
	}

	textAlignment: TextAlignmentType = TextAlignmentType.Left;

	textAngle: number = 0;

	textAttachmentDirection: TextAttachmentDirectionType = TextAttachmentDirectionType.Horizontal;

	textAttachmentPoint: TextAttachmentPointType = TextAttachmentPointType.Center;

	textBottomAttachment: TextAttachmentType = TextAttachmentType.CenterOfText;

	textColor: Color = Color.ByBlock;

	textFrame: boolean = false;

	textLeftAttachment: TextAttachmentType = TextAttachmentType.MiddleOfTopLine;

	textRightAttachment: TextAttachmentType = TextAttachmentType.MiddleOfTopLine;

	textStyle: TextStyle | null = null;

	textTopAttachment: TextAttachmentType = TextAttachmentType.CenterOfText;

	textDirectionNegative: boolean = false;

	textAligninIPE: boolean = false;

	override applyTransform(transform: unknown): void {
		// No-op
	}

	override clone(): CadObject {
		const clone = super.clone() as MultiLeader;
		clone.arrowhead = this.arrowhead?.clone() as BlockRecord | null ?? null;
		clone.blockContentId = this.blockContentId?.clone() as BlockRecord | null ?? null;
		clone.style = this.style?.clone() as MultiLeaderStyle | null ?? null;
		clone.textStyle = this.textStyle?.clone() as TextStyle | null ?? null;
		clone.contextData = this.contextData.clone() as MultiLeaderObjectContextData;
		clone.blockAttributes = this.blockAttributes.map(a => a.clone());
		return clone;
	}

	getBoundingBox(): BoundingBox | null {
		const points: XYZ[] = [];
		const pushPair = (pair: StartEndPointPair): void => {
			points.push(pair.startPoint, pair.endPoint);
		};
		const pushLeaderLine = (line: LeaderLine): void => {
			points.push(...line.points);
			for (const pair of line.startEndPoints) {
				pushPair(pair);
			}
		};
		const pushLeaderRoot = (root: LeaderRoot): void => {
			points.push(root.connectionPoint, root.direction);
			for (const pair of root.breakStartEndPointsPairs) {
				pushPair(pair);
			}
			for (const line of root.lines) {
				pushLeaderLine(line);
			}
		};

		points.push(this.contextData.basePoint, this.contextData.contentBasePoint, this.contextData.textLocation);
		if (this.contextData.hasContentsBlock) {
			points.push(this.contextData.blockContentLocation);
		}
		for (const root of this.contextData.leaderRoots) {
			pushLeaderRoot(root);
		}

		return points.length > 0 ? BoundingBox.FromPoints(points) : null;
	}
}

export { MultiLeaderPropertyOverrideFlags } from './MultiLeaderPropertyOverrideFlags.js';

export { MultiLeaderPathType } from '../MultiLeaderPathType.js';

export { LeaderContentType } from '../Objects/LeaderContentType.js';

export { TextAttachmentType } from '../TextAttachmentType.js';

export { TextAlignmentType } from '../TextAlignmentType.js';

export { TextAttachmentPointType } from '../TextAttachmentPoint.js';

export { TextAttachmentDirectionType } from '../TextAttachmentDirectionType.js';
