import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { CadDocument } from '../CadDocument.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { TextStyle } from '../Tables/TextStyle.js';
import { AttachmentPointType } from './AttachmentPointType.js';
import { BackgroundFillFlags } from './BackgroundFillFlags.js';
import { ColumnType } from './ColumnType.js';
import { DrawingDirectionType } from './DrawingDirectionType.js';
import { LineSpacingStyleType } from './LineSpacingStyleType.js';
import { Color } from '../Color.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import { IText } from './IText.js';
import { XYZ } from '../Math/XYZ.js';

export class TextColumnData {
	columnType: ColumnType = ColumnType.NoColumns;
	columnCount: number = 0;
	flowReversed: boolean = false;
	autoHeight: boolean = false;
	width: number = 0;
	gutter: number = 0;
	heights: number[] = [];

	clone(): TextColumnData {
		const c = new TextColumnData();
		c.columnType = this.columnType;
		c.columnCount = this.columnCount;
		c.flowReversed = this.flowReversed;
		c.autoHeight = this.autoHeight;
		c.width = this.width;
		c.gutter = this.gutter;
		c.heights = [...this.heights];
		return c;
	}
}

export class MText extends Entity implements IText {
	alignmentPoint: XYZ = new XYZ(0, 0, 0);

	attachmentPoint: AttachmentPointType = AttachmentPointType.TopLeft;

	backgroundColor: Color | null = null;

	backgroundFillFlags: BackgroundFillFlags = BackgroundFillFlags.None;

	backgroundScale: number = 1.5;

	backgroundTransparency: number = 0;

	get columnData(): TextColumnData | null {
		return this._columnData;
	}
	set columnData(value: TextColumnData | null) {
		this._columnData = value;
	}

	drawingDirection: DrawingDirectionType = DrawingDirectionType.LeftToRight;

	get hasColumns(): boolean {
		return this._columnData != null && this._columnData.columnType !== ColumnType.NoColumns;
	}

	get height(): number {
		return this._height;
	}
	set height(value: number) {
		if (value <= 0) {
			throw new Error('The text height must be greater than zero.');
		}
		this._height = value;
	}

	horizontalWidth: number = 0;

	insertPoint: XYZ = new XYZ(0, 0, 0);

	isAnnotative: boolean = false;

	lineSpacing: number = 1.0;

	lineSpacingStyle: LineSpacingStyleType = LineSpacingStyleType.AtLeast;

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.EntityMText;
	}

	override get objectType(): ObjectType {
		return ObjectType.MTEXT;
	}

	get plainText(): string {
		// TODO: TextProcessor.Parse not available
		return this._value;
	}

	rectangleHeight: number = 0;

	rectangleWidth: number = 0;

	get rotation(): number {
		return Math.atan2(this.alignmentPoint.y, this.alignmentPoint.x);
	}
	set rotation(value: number) {
		this.alignmentPoint = new XYZ(Math.cos(value), Math.sin(value), 0,);
	}

	get style(): TextStyle {
		return this._style;
	}
	set style(value: TextStyle) {
		if (value == null) {
			throw new Error('value cannot be null');
		}
		if (this.document != null) {
			this._style = CadObject.updateCollection(value, this.document.textStyles);
		} else {
			this._style = value;
		}
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.MText;
	}

	get value(): string {
		return this._value;
	}
	set value(v: string) {
		this._value = v;
	}

	verticalHeight: number = 0;

	private _height: number = 1.0;
	private _style: TextStyle = TextStyle.Default;
	private _value: string = '';
	private _columnData: TextColumnData | null = null;

	constructor() {
		super();
	}

	override applyTransform(transform: any): void {
		// TODO: Complex transform with attachment point swapping
	}

	override clone(): CadObject {
		const clone = super.clone() as MText;
		clone._style = this._style.clone() as TextStyle;
		if (this._columnData) {
			clone._columnData = this._columnData.clone();
		}
		return clone;
	}

	override getBoundingBox(): any {
		return null;
	}

	getPlainTextLines(): string[] {
		return this.plainText.split(/\r\n|\r|\n/);
	}

	getTextLines(): string[] {
		const combined = this._value.replace(/\\P/gi, '\n');
		return combined.split(/\r\n|\r|\n/);
	}

	/** @internal */
	assignDocument(doc: CadDocument): void {
		super.assignDocument(doc);
		this._style = CadObject.updateCollection(this._style, doc.textStyles);
	}

	/** @internal */
	unassignDocument(): void {
		super.unassignDocument();
		this._style = this._style.clone() as TextStyle;
	}

	protected override _tableOnRemove(sender: any, e: CollectionChangedEventArgs): void {
		super._tableOnRemove(sender, e);
		if (e.item === this._style) {
			this._style = this.document!.textStyles.get(TextStyle.DefaultName)!;
		}
	}
}

export { AttachmentPointType } from './AttachmentPointType.js';

export { DrawingDirectionType } from './DrawingDirectionType.js';

export { LineSpacingStyleType } from './LineSpacingStyleType.js';

export { BackgroundFillFlags } from './BackgroundFillFlags.js';

export { ColumnType } from './ColumnType.js';
