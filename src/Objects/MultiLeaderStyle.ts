import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CadObject } from '../CadObject.js';
import type { CadDocument } from '../CadDocument.js';
import { Color } from '../Color.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { LeaderContentType } from './LeaderContentType.js';
import { LeaderDrawOrderType } from './LeaderDrawOrderType.js';
import { MultiLeaderDrawOrderType } from './MultiLeaderDrawOrderType.js';
import { BlockRecord } from '../Tables/BlockRecord.js';
import { LineType } from '../Tables/LineType.js';
import { TextStyle } from '../Tables/TextStyle.js';
import { XYZ } from '../Math/XYZ.js';

export class MultiLeaderStyle extends NonGraphicalObject {
	static get default_(): MultiLeaderStyle { return new MultiLeaderStyle(MultiLeaderStyle.defaultName); }

	alignSpace: number = 0.0;

	private _arrowhead: BlockRecord | null = null;
	get arrowhead(): BlockRecord | null { return this._arrowhead; }
	set arrowhead(value: BlockRecord | null) {
		this._arrowhead = CadObject.updateCollectionStatic(value, this.document?.blockRecords ?? null);
	}

	arrowheadSize: number = 0.18;

	private _blockContent: BlockRecord | null = null;
	get blockContent(): BlockRecord | null { return this._blockContent; }
	set blockContent(value: BlockRecord | null) {
		this._blockContent = CadObject.updateCollectionStatic(value, this.document?.blockRecords ?? null);
	}

	blockContentColor: Color = Color.byBlock;
	blockContentConnection: number = 0;
	blockContentRotation: number = 0.0;

	private _blockContentScale: XYZ = new XYZ(1, 1, 1);
	get blockContentScale(): XYZ { return this._blockContentScale; }
	set blockContentScale(value: XYZ) { this._blockContentScale = value; }

	get blockContentScaleX(): number { return this._blockContentScale.x; }
	set blockContentScaleX(value: number) { this._blockContentScale.x = value; }

	get blockContentScaleY(): number { return this._blockContentScale.y; }
	set blockContentScaleY(value: number) { this._blockContentScale.y = value; }

	get blockContentScaleZ(): number { return this._blockContentScale.z; }
	set blockContentScaleZ(value: number) { this._blockContentScale.z = value; }

	breakGapSize: number = 0.125;
	contentType: LeaderContentType = LeaderContentType.MText;
	defaultTextContents: string = '';
	description: string = '';
	enableBlockContentRotation: boolean = false;
	enableBlockContentScale: boolean = false;
	enableDogleg: boolean = true;
	enableLanding: boolean = true;
	firstSegmentAngleConstraint: number = 0;
	isAnnotative: boolean = false;
	landingDistance: number = 0.36;
	landingGap: number = 0.09;
	leaderDrawOrder: LeaderDrawOrderType = LeaderDrawOrderType.LeaderHeadFirst;

	private _leaderLineType: LineType | null = null;
	get leaderLineType(): LineType | null { return this._leaderLineType; }
	set leaderLineType(value: LineType | null) {
		if (value == null) throw new Error('value cannot be null');
		this._leaderLineType = CadObject.updateCollectionStatic(value, this.document?.lineTypes ?? null);
	}

	leaderLineWeight: number = 0;
	lineColor: Color = Color.byLayer;
	maxLeaderSegmentsPoints: number = 2;
	multiLeaderDrawOrder: MultiLeaderDrawOrderType = MultiLeaderDrawOrderType.ContentFirst;

	override get objectName(): string { return DxfFileToken.objectMLeaderStyle; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }

	overwritePropertyValue: boolean = false;
	pathType: number = 0;
	scaleFactor: number = 1;
	secondSegmentAngleConstraint: number = 0;

	override get subclassMarker(): string { return DxfSubclassMarker.mLeaderStyle; }

	textAlignAlwaysLeft: boolean = false;
	textAlignment: number = 0;
	textAngle: number = 0;
	textAttachmentDirection: number = 0;
	textBottomAttachment: number = 0;
	textColor: Color = Color.byBlock;
	textFrame: boolean = false;
	textHeight: number = 0.18;
	textLeftAttachment: number = 0;
	textRightAttachment: number = 0;

	private _textStyle: TextStyle | null = null;
	get textStyle(): TextStyle | null { return this._textStyle; }
	set textStyle(value: TextStyle | null) {
		if (value == null) throw new Error('value cannot be null');
		this._textStyle = CadObject.updateCollectionStatic(value, this.document?.textStyles ?? null);
	}

	textTopAttachment: number = 0;
	unknownFlag298: boolean = false;

	static readonly defaultName = 'Standard';

	constructor(name: string = '') {
		super(name);
	}

	override clone(): CadObject {
		const clone = super.clone() as MultiLeaderStyle;
		clone._textStyle = this._textStyle?.clone() as TextStyle | null ?? null;
		clone._leaderLineType = this._leaderLineType?.clone() as LineType | null ?? null;
		clone._arrowhead = this._arrowhead?.clone() as BlockRecord | null ?? null;
		clone._blockContent = this._blockContent?.clone() as BlockRecord | null ?? null;
		return clone;
	}

	override assignDocument(doc: CadDocument): void {
		super.assignDocument(doc);
		this._arrowhead = CadObject.updateCollectionStatic(this._arrowhead, doc.blockRecords);
		this._blockContent = CadObject.updateCollectionStatic(this._blockContent, doc.blockRecords);
		this._leaderLineType = CadObject.updateCollectionStatic(this._leaderLineType, doc.lineTypes);
		this._textStyle = CadObject.updateCollectionStatic(this._textStyle, doc.textStyles);
	}

	override unassignDocument(): void {
		super.unassignDocument();
		this._arrowhead = this._arrowhead?.clone() as BlockRecord | null ?? null;
		this._blockContent = this._blockContent?.clone() as BlockRecord | null ?? null;
		this._leaderLineType = this._leaderLineType?.clone() as LineType | null ?? null;
		this._textStyle = this._textStyle?.clone() as TextStyle | null ?? null;
	}
}

export { MultiLeaderDrawOrderType } from './MultiLeaderDrawOrderType.js';

export { LeaderDrawOrderType } from './LeaderDrawOrderType.js';
