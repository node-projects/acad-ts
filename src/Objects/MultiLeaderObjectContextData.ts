import { AnnotScaleObjectContextData } from './AnnotScaleObjectContextData.js';
import { CadObject } from '../CadObject.js';
import { Color } from '../Color.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';
import { Matrix4 } from '../Math/Matrix4.js';

export class StartEndPointPair {
	startPoint: XYZ;
	endPoint: XYZ;

	constructor(startPoint: XYZ = new XYZ(0, 0, 0), endPoint: XYZ = new XYZ(0, 0, 0)) {
		this.startPoint = startPoint;
		this.endPoint = endPoint;
	}

	clone(): StartEndPointPair {
		return new StartEndPointPair(
			new XYZ(this.startPoint.x, this.startPoint.y, this.startPoint.z),
			new XYZ(this.endPoint.x, this.endPoint.y, this.endPoint.z)
		);
	}
}

export class LeaderLine {
	arrowhead: any = null;
	arrowheadSize: number = 0;
	breakInfoCount: number = 0;
	index: number = 0;
	lineColor: Color = Color.ByLayer;

	private _lineType: any = null;
	get lineType(): any { return this._lineType; }
	set lineType(value: any) { this._lineType = value; }

	lineWeight: number = 0;
	overrideFlags: number = 0;
	pathType: number = 0;
	points: XYZ[] = [];
	segmentIndex: number = 0;
	startEndPoints: StartEndPointPair[] = [];

	document: any = null;

	assignDocument(doc: any): void {
		this.document = doc;
		// TODO: update line type from doc.lineTypes
	}

	clone(): LeaderLine {
		const clone = new LeaderLine();
		clone.arrowheadSize = this.arrowheadSize;
		clone.breakInfoCount = this.breakInfoCount;
		clone.index = this.index;
		clone.lineColor = this.lineColor;
		clone.lineWeight = this.lineWeight;
		clone.overrideFlags = this.overrideFlags;
		clone.pathType = this.pathType;
		clone.segmentIndex = this.segmentIndex;
		clone.points = this.points.map(p => new XYZ(p.x, p.y, p.z));
		clone.startEndPoints = this.startEndPoints.map(s => s.clone());
		return clone;
	}

	unassignDocument(): void {
		this.document = null;
	}
}

export class LeaderRoot {
	breakStartEndPointsPairs: StartEndPointPair[] = [];
	connectionPoint: XYZ = new XYZ(0, 0, 0);
	contentValid: boolean = false;
	direction: XYZ = new XYZ(0, 0, 0);
	landingDistance: number = 0;
	leaderIndex: number = 0;
	lines: LeaderLine[] = [];
	textAttachmentDirection: number = 0;
	unknown: boolean = false;

	clone(): LeaderRoot {
		const clone = new LeaderRoot();
		clone.connectionPoint = new XYZ(this.connectionPoint.x, this.connectionPoint.y, this.connectionPoint.z);
		clone.contentValid = this.contentValid;
		clone.direction = new XYZ(this.direction.x, this.direction.y, this.direction.z);
		clone.landingDistance = this.landingDistance;
		clone.leaderIndex = this.leaderIndex;
		clone.textAttachmentDirection = this.textAttachmentDirection;
		clone.unknown = this.unknown;
		clone.breakStartEndPointsPairs = this.breakStartEndPointsPairs.map(s => s.clone());
		clone.lines = this.lines.map(l => l.clone() as LeaderLine);
		return clone;
	}
}

export class MultiLeaderObjectContextData extends AnnotScaleObjectContextData {
	arrowheadSize: number = 0;
	backgroundFillColor: Color = Color.ByLayer;
	backgroundFillEnabled: boolean = false;
	backgroundMaskFillOn: boolean = false;
	backgroundScaleFactor: number = 0;
	backgroundTransparency: number = 0;
	baseDirection: XYZ = new XYZ(0, 0, 0);
	basePoint: XYZ = new XYZ(0, 0, 0);
	baseVertical: XYZ = new XYZ(0, 0, 0);

	private _blockContent: any = null;
	get blockContent(): any { return this._blockContent; }
	set blockContent(value: any) {
		this._blockContent = value;
	}

	blockContentColor: Color = Color.ByLayer;
	blockContentConnection: number = 0;
	blockContentLocation: XYZ = new XYZ(0, 0, 0);
	blockContentNormal: XYZ = new XYZ(0, 0, 0);
	blockContentRotation: number = 0;
	blockContentScale: XYZ = new XYZ(1, 1, 1);
	boundaryHeight: number = 0;
	boundaryWidth: number = 0;
	columnFlowReversed: boolean = false;
	columnGutter: number = 0;
	columnSizes: number[] = [];
	columnType: number = 0;
	columnWidth: number = 0;
	contentBasePoint: XYZ = new XYZ(0, 0, 0);
	direction: XYZ = new XYZ(0, 0, 0);
	flowDirection: number = 0;
	hasContentsBlock: boolean = false;
	hasTextContents: boolean = false;
	landingGap: number = 0;
	leaderRoots: LeaderRoot[] = [];
	lineSpacing: number = 0;
	lineSpacingFactor: number = 0;
	normalReversed: boolean = false;

	override get objectName(): string { return DxfFileToken.ObjectMLeaderContextData; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }

	scaleFactor: number = 0;

	override get subclassMarker(): string { return DxfSubclassMarker.MultiLeaderObjectContextData; }

	textAlignment: number = 0;
	textAttachmentPoint: number = 0;
	textBottomAttachment: number = 0;
	textColor: Color = Color.ByLayer;
	textHeight: number = 0;
	textHeightAutomatic: boolean = false;
	textLabel: string = '';
	textLeftAttachment: number = 0;
	textLocation: XYZ = new XYZ(0, 0, 0);
	textNormal: XYZ = new XYZ(0, 0, 0);
	textRightAttachment: number = 0;
	textRotation: number = 0;

	private _textStyle: any = null;
	get textStyle(): any { return this._textStyle; }
	set textStyle(value: any) {
		if (value == null) throw new Error('value cannot be null');
		this._textStyle = value;
	}

	textTopAttachment: number = 0;
	transformationMatrix: Matrix4 = Matrix4.identity();
	wordBreak: boolean = false;

	override clone(): CadObject {
		const clone = super.clone() as MultiLeaderObjectContextData;
		clone.leaderRoots = this.leaderRoots.map(r => r.clone());
		// TODO: clone textStyle, blockContent
		return clone;
	}
}
