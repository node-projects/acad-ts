import { Entity } from './Entity.js';
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
import { XYZ } from '../Math/XYZ.js';
import { LineType } from '../Tables/LineType.js';

export class MultiLeaderBlockAttribute {
	attributeDefinition: any = null;
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
	arrowhead: any = null;

	arrowheadSize: number = 0;

	blockAttributes: MultiLeaderBlockAttribute[] = [];

	blockContentColor: Color = Color.ByBlock;

	blockContentConnection: number = 0;

	blockContentId: any = null;

	blockContentRotation: number = 0;

	blockContentScale: XYZ = new XYZ(1, 1, 1);

	contentType: LeaderContentType = LeaderContentType.MText;

	contextData: any = null;

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

	style: any = null;

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

	textStyle: any = null;

	textTopAttachment: TextAttachmentType = TextAttachmentType.CenterOfText;

	textDirectionNegative: boolean = false;

	textAligninIPE: boolean = false;

	override applyTransform(transform: any): void {
		// No-op
	}

	override clone(): CadObject {
		const clone = super.clone() as MultiLeader;
		clone.contextData = this.contextData; // TODO: deep clone
		clone.blockAttributes = this.blockAttributes.map(a => a.clone());
		return clone;
	}

	getBoundingBox(): any { return null; }
}

export { MultiLeaderPropertyOverrideFlags } from './MultiLeaderPropertyOverrideFlags.js';

export { MultiLeaderPathType } from '../MultiLeaderPathType.js';

export { LeaderContentType } from '../Objects/LeaderContentType.js';

export { TextAttachmentType } from '../TextAttachmentType.js';

export { TextAlignmentType } from '../TextAlignmentType.js';

export { TextAttachmentPointType } from '../TextAttachmentPoint.js';

export { TextAttachmentDirectionType } from '../TextAttachmentDirectionType.js';
