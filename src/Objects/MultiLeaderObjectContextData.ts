import { AnnotScaleObjectContextData } from './AnnotScaleObjectContextData.js';
import { CadObject } from '../CadObject.js';
import type { CadDocument } from '../CadDocument.js';
import { Color } from '../Color.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { BlockRecord } from '../Tables/BlockRecord.js';
import { LineType } from '../Tables/LineType.js';
import { TextStyle } from '../Tables/TextStyle.js';
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
	arrowhead: BlockRecord | null = null;
	arrowheadSize: number = 0;
	breakInfoCount: number = 0;
	index: number = 0;
	lineColor: Color = Color.byLayer;

	private _lineType: LineType | null = null;
	get lineType(): LineType | null { return this._lineType; }
	set lineType(value: LineType | null) { this._lineType = value; }

	lineWeight: number = 0;
	overrideFlags: number = 0;
	pathType: number = 0;
	points: XYZ[] = [];
	segmentIndex: number = 0;
	startEndPoints: StartEndPointPair[] = [];

	document: CadDocument | null = null;

	assignDocument(doc: CadDocument): void {
		this.document = doc;
		this._lineType = CadObject.updateCollectionStatic(this._lineType, doc.lineTypes);
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
		clone.arrowhead = this.arrowhead?.clone() as BlockRecord | null ?? null;
		clone._lineType = this._lineType?.clone() as LineType | null ?? null;
		clone.points = this.points.map(p => new XYZ(p.x, p.y, p.z));
		clone.startEndPoints = this.startEndPoints.map(s => s.clone());
		return clone;
	}

	unassignDocument(): void {
		this._lineType = this._lineType?.clone() as LineType | null ?? null;
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
	backgroundFillColor: Color = Color.byLayer;
	backgroundFillEnabled: boolean = false;
	backgroundMaskFillOn: boolean = false;
	backgroundScaleFactor: number = 0;
	backgroundTransparency: number = 0;
	baseDirection: XYZ = new XYZ(0, 0, 0);
	basePoint: XYZ = new XYZ(0, 0, 0);
	baseVertical: XYZ = new XYZ(0, 0, 0);

	private _blockContent: BlockRecord | null = null;
	get blockContent(): BlockRecord | null { return this._blockContent; }
	set blockContent(value: BlockRecord | null) {
		this._blockContent = CadObject.updateCollectionStatic(value, this.document?.blockRecords ?? null);
	}

	blockContentColor: Color = Color.byLayer;
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

	override get objectName(): string { return DxfFileToken.objectMLeaderContextData; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }

	scaleFactor: number = 0;

	override get subclassMarker(): string { return DxfSubclassMarker.multiLeaderObjectContextData; }

	textAlignment: number = 0;
	textAttachmentPoint: number = 0;
	textBottomAttachment: number = 0;
	textColor: Color = Color.byLayer;
	textHeight: number = 0;
	textHeightAutomatic: boolean = false;
	textLabel: string = '';
	textLeftAttachment: number = 0;
	textLocation: XYZ = new XYZ(0, 0, 0);
	textNormal: XYZ = new XYZ(0, 0, 0);
	textRightAttachment: number = 0;
	textRotation: number = 0;

	private _textStyle: TextStyle | null = null;
	get textStyle(): TextStyle | null { return this._textStyle; }
	set textStyle(value: TextStyle | null) {
		if (value == null) throw new Error('value cannot be null');
		this._textStyle = CadObject.updateCollectionStatic(value, this.document?.textStyles ?? null);
	}

	textTopAttachment: number = 0;
	transformationMatrix: Matrix4 = Matrix4.identity();
	wordBreak: boolean = false;

	override clone(): CadObject {
		const clone = super.clone() as MultiLeaderObjectContextData;
		clone.leaderRoots = this.leaderRoots.map(r => r.clone());
		clone._textStyle = this._textStyle?.clone() as TextStyle | null ?? null;
		clone._blockContent = this._blockContent?.clone() as BlockRecord | null ?? null;
		return clone;
	}

	override assignDocument(doc: CadDocument): void {
		super.assignDocument(doc);
		this._blockContent = CadObject.updateCollectionStatic(this._blockContent, doc.blockRecords);
		this._textStyle = CadObject.updateCollectionStatic(this._textStyle, doc.textStyles);
		for (const root of this.leaderRoots) {
			for (const line of root.lines) {
				line.assignDocument(doc);
			}
		}
	}

	override unassignDocument(): void {
		super.unassignDocument();
		this._blockContent = this._blockContent?.clone() as BlockRecord | null ?? null;
		this._textStyle = this._textStyle?.clone() as TextStyle | null ?? null;
		for (const root of this.leaderRoots) {
			for (const line of root.lines) {
				line.unassignDocument();
			}
		}
	}
}
