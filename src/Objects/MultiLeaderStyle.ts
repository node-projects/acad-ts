import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CadObject } from '../CadObject.js';
import { Color } from '../Color.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { LeaderContentType } from './LeaderContentType.js';
import { LeaderDrawOrderType } from './LeaderDrawOrderType.js';
import { MultiLeaderDrawOrderType } from './MultiLeaderDrawOrderType.js';
import { XYZ } from '../Math/XYZ.js';

export class MultiLeaderStyle extends NonGraphicalObject {
	static get default_(): MultiLeaderStyle { return new MultiLeaderStyle(MultiLeaderStyle.DefaultName); }

	alignSpace: number = 0.0;

	private _arrowhead: any = null;
	get arrowhead(): any { return this._arrowhead; }
	set arrowhead(value: any) { this._arrowhead = value; }

	arrowheadSize: number = 0.18;

	private _blockContent: any = null;
	get blockContent(): any { return this._blockContent; }
	set blockContent(value: any) { this._blockContent = value; }

	blockContentColor: Color = Color.ByBlock;
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

	private _leaderLineType: any = null;
	get leaderLineType(): any { return this._leaderLineType; }
	set leaderLineType(value: any) {
		if (value == null) throw new Error('value cannot be null');
		this._leaderLineType = value;
	}

	leaderLineWeight: number = 0;
	lineColor: Color = Color.ByLayer;
	maxLeaderSegmentsPoints: number = 2;
	multiLeaderDrawOrder: MultiLeaderDrawOrderType = MultiLeaderDrawOrderType.ContentFirst;

	override get objectName(): string { return DxfFileToken.ObjectMLeaderStyle; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }

	overwritePropertyValue: boolean = false;
	pathType: number = 0;
	scaleFactor: number = 1;
	secondSegmentAngleConstraint: number = 0;

	override get subclassMarker(): string { return DxfSubclassMarker.MLeaderStyle; }

	textAlignAlwaysLeft: boolean = false;
	textAlignment: number = 0;
	textAngle: number = 0;
	textAttachmentDirection: number = 0;
	textBottomAttachment: number = 0;
	textColor: Color = Color.ByBlock;
	textFrame: boolean = false;
	textHeight: number = 0.18;
	textLeftAttachment: number = 0;
	textRightAttachment: number = 0;

	private _textStyle: any = null;
	get textStyle(): any { return this._textStyle; }
	set textStyle(value: any) {
		if (value == null) throw new Error('value cannot be null');
		this._textStyle = value;
	}

	textTopAttachment: number = 0;
	unknownFlag298: boolean = false;

	static readonly DefaultName = 'Standard';

	constructor(name: string = '') {
		super(name);
	}

	override clone(): CadObject {
		const clone = super.clone() as MultiLeaderStyle;
		// TODO: clone textStyle, leaderLineType, arrowhead, blockContent
		return clone;
	}
}

export { MultiLeaderDrawOrderType } from './MultiLeaderDrawOrderType.js';

export { LeaderDrawOrderType } from './LeaderDrawOrderType.js';
