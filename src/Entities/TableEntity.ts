import { Insert } from './Insert.js';
import { CadObject } from '../CadObject.js';
import { Color } from '../Color.js';
import { CadValue } from '../CadValue.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { LineWeightType } from '../Types/LineWeightType.js';
import { XYZ } from '../Math/XYZ.js';
import type { BoundingBox } from '../Math/BoundingBox.js';
import type { TableStyle } from '../Objects/TableStyle.js';
import type { TextStyle } from '../Tables/TextStyle.js';
import type { AttributeDefinition } from './AttributeDefinition.js';
import type { BlockRecord } from '../Tables/BlockRecord.js';
import type { Field } from '../Objects/Field.js';
import type { LineType } from '../Tables/LineType.js';
import { tableOwnedList } from './TableOwnedList.js';

function copyTablePoint(point: XYZ): XYZ { return new XYZ(point.x, point.y, point.z); }

// === Enums ===

export enum TableEntityBorderType {
	Single = 1,
	Double = 2,
}

export enum BreakFlowDirection {
	Right = 1,
	Vertical = 2,
	Left = 4,
}

export enum BreakOptionFlags {
	None = 0,
	EnableBreaks = 1,
	RepeatTopLabels = 2,
	RepeatBottomLabels = 4,
	AllowManualPositions = 8,
	AllowManualHeights = 16,
}

export enum CellAlignmentType {
	None = 0,
	TopLeft = 1,
	TopCenter = 2,
	TopRight = 3,
	MiddleLeft = 4,
	MiddleCenter = 5,
	MiddleRight = 6,
	BottomLeft = 7,
	BottomCenter = 8,
	BottomRight = 9,
}

export enum CellEdgeFlags {
	Unknown = 0,
	Top = 1,
	Right = 2,
	Bottom = 4,
	Left = 8,
	InsideVertical = 16,
	InsideHorizontal = 32,
}

export enum CellStyleClass {
	Data = 1,
	Label = 2,
}

export enum CellStyleType {
	Unknown = 0,
	Cell = 1,
	Row = 2,
	Column = 3,
	FormattedTableData = 4,
	Table = 5,
}

export enum CellType {
	Text = 1,
	Block = 2,
}

export enum MarginFlags {
	None = 0,
	Override = 1,
}

export enum TableBorderPropertyFlags {
	None = 0x0,
	BorderType = 0x1,
	LineWeight = 0x2,
	LineType = 0x4,
	Color = 0x8,
	Invisibility = 0x10,
	DoubleLineSpacing = 0x20,
	All = 0x3F,
}

export enum TableCellContentLayoutFlags {
	None = 0,
	Flow = 1,
	StackedHorizontal = 2,
	StackedVertical = 4,
}

export enum TableCellContentType {
	Unknown = 0,
	Value = 0x1,
	Field = 0x2,
	Block = 0x4,
}

export enum TableCellStateFlags {
	None = 0x0,
	ContentLocked = 0x1,
	ContentReadOnly = 0x2,
	Linked = 0x4,
	ContentModifiedAfterUpdate = 0x8,
	FormatLocked = 0x10,
	FormatReadOnly = 0x20,
	FormatModifiedAfterUpdate = 0x40,
}

export enum TableCellStylePropertyFlags {
	None = 0x0,
	DataType = 0x1,
	DataFormat = 0x2,
	Rotation = 0x4,
	BlockScale = 0x8,
	Alignment = 0x10,
	ContentColor = 0x20,
	TextStyle = 0x40,
	TextHeight = 0x80,
	AutoScale = 0x100,
	BackgroundColor = 0x200,
	MarginLeft = 0x400,
	MarginTop = 0x800,
	MarginRight = 0x1000,
	MarginBottom = 0x2000,
	ContentLayout = 0x4000,
	MarginHorizontalSpacing = 0x20000,
	MarginVerticalSpacing = 0x40000,
	MergeAll = 0x8000,
	FlowDirectionBottomToTop = 0x10000,
}

export enum TableEntityValueUnitType {
	NoUnits = 0,
	Distance = 1,
	Angle = 2,
	Area = 4,
	Volume = 8,
	Currency = 0x10,
	Percentage = 0x20,
}

// Internal enums
export enum BorderOverrideFlags {
	None = 0,
	TitleHorizontalTop = 0x01,
	TitleHorizontalInsert = 0x02,
	TitleHorizontalBottom = 0x04,
	TitleVerticalLeft = 0x8,
	TitleVerticalInsert = 0x10,
	TitleVerticalRight = 0x20,
	HeaderHorizontalTop = 0x40,
	HeaderHorizontalInsert = 0x80,
	HeaderHorizontalBottom = 0x100,
	HeaderVerticalLeft = 0x200,
	HeaderVerticalInsert = 0x400,
	HeaderVerticalRight = 0x800,
	DataHorizontalTop = 0x1000,
	DataHorizontalInsert = 0x2000,
	DataHorizontalBottom = 0x4000,
	DataVerticalLeft = 0x8000,
	DataVerticalInsert = 0x10000,
	DataVerticalRight = 0x20000,
}

export enum TableOverrideFlags {
	None = 0,
	TitleSuppressed = 0x0001,
	HeaderSuppressed = 0x02,
	FlowDirection = 0x0004,
	HorizontalCellMargin = 0x0008,
	VerticalCellMargin = 0x0010,
	TitleRowColor = 0x0020,
	HeaderRowColor = 0x00040,
	DataRowColor = 0x0080,
	TitleRowFillNone = 0x0100,
	HeaderRowFillNone = 0x0200,
	DataRowFillNone = 0x0400,
	TitleRowFillColor = 0x0800,
	HeaderRowFillColor = 0x1000,
	DataRowFillColor = 0x2000,
	TitleRowAlign = 0x4000,
	HeaderRowAlign = 0x8000,
	DataRowAlign = 0x10000,
	TitleTextStyle = 0x20000,
	HeaderTextStyle = 0x40000,
	DataTextStyle = 0x80000,
	TitleRowHeight = 0x100000,
	HeaderRowHeight = 0x200000,
	DataRowHeight = 0x400000,
}

export enum CellOverrideFlags {
	None = 0,
	CellAlignment = 0x01,
	BackgroundFillNone = 0x02,
	BackgroundColor = 0x04,
	ContentColor = 0x08,
	TextStyle = 0x10,
	TextHeight = 0x20,
	TopGridColor = 0x00040,
	TopGridLineWeight = 0x00400,
	TopVisibility = 0x04000,
	RightGridColor = 0x00080,
	RightGridLineWeight = 0x00800,
	RightVisibility = 0x08000,
	BottomGridColor = 0x00100,
	BottomGridLineWeight = 0x01000,
	BottomVisibility = 0x10000,
	LeftGridColor = 0x00200,
	LeftGridLineWeight = 0x02000,
	LeftVisibility = 0x20000,
}

// === Data Classes ===

export class TableAttribute {
	clone(): TableAttribute { return Object.assign(new TableAttribute(), this, { attributeDefinition: this.attributeDefinition?.clone() ?? null }); }
	attributeDefinition: AttributeDefinition | null = null;
	value: string = '';
	index: number = 1;
}

export class CustomDataEntry {
	clone(): CustomDataEntry { return Object.assign(new CustomDataEntry(), this, { value: this.value.clone() }); }
	name: string = '';
	value: CadValue = new CadValue();
}

export class CellContentGeometry {
	clone(): CellContentGeometry { return Object.assign(new CellContentGeometry(), this, { distanceTopLeft: copyTablePoint(this.distanceTopLeft), distanceCenter: copyTablePoint(this.distanceCenter) }); }
	distanceTopLeft: XYZ = new XYZ(0, 0, 0);
	distanceCenter: XYZ = new XYZ(0, 0, 0);
	contentWidth: number = 0;
	contentHeight: number = 0;
	width: number = 0;
	height: number = 0;
	flags: number = 0;
}

export class CellRange {
	clone(): CellRange { return Object.assign(new CellRange(), this); }
	bottomRowIndex: number = 0;
	leftColumnIndex: number = 0;
	rightColumnIndex: number = 0;
	topRowIndex: number = 0;
}

export class ContentFormat {
	protected _owner: CadObject | null = null;
	get owner(): CadObject | null { return this._owner; }
	set owner(value: CadObject | null) {
		this._owner = value;
		if (!value) this._textStyle = this._textStyle?.clone() as TextStyle | null ?? null;
	}
	alignment: number = 0;
	color: Color = Color.byBlock;
	hasData: boolean = false;
	propertyFlags: number = 0;
	propertyOverrideFlags: TableCellStylePropertyFlags = 0;
	rotation: number = 0;
	scale: number = 0;
	textHeight: number = 0;
	private _textStyle: TextStyle | null = null;
	get textStyle(): TextStyle | null {
		if (this._textStyle && this.owner?.document?.textStyles) {
			this._textStyle = this.owner.document.textStyles.tryAdd(this._textStyle);
		}
		return this._textStyle;
	}
	set textStyle(value: TextStyle | null) {
		this._textStyle = value && this.owner?.document?.textStyles ? this.owner.document.textStyles.tryAdd(value) : value;
	}
	clone(): this {
		const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this) as this;
		clone.owner = null;
		return clone;
	}
	valueDataType: number = 0;
	valueFormatString: string = '';
	valueUnitType: number = 0;
}

export class CellBorder {
	clone(): CellBorder {
		const copy = Object.assign(new CellBorder(this.edgeFlags), this);
		copy.owner = null;
		return copy;
	}
	private _owner: CadObject | null = null;
	get owner(): CadObject | null { return this._owner; }
	set owner(value: CadObject | null) {
		this._owner = value;
		if (!value) this._lineType = this._lineType?.clone() as LineType | null ?? null;
	}
	color: Color = Color.byBlock;
	doubleLineSpacing: number = 0;
	readonly edgeFlags: CellEdgeFlags;
	isInvisible: boolean = false;
	lineWeight: LineWeightType = LineWeightType.Default;
	private _lineType: LineType | null = null;
	get lineType(): LineType | null {
		if (this._lineType && this.owner?.document?.lineTypes) this._lineType = this.owner.document.lineTypes.tryAdd(this._lineType);
		return this._lineType;
	}
	set lineType(value: LineType | null) {
		this._lineType = value && this.owner?.document?.lineTypes ? this.owner.document.lineTypes.tryAdd(value) : value;
	}
	propertyOverrideFlags: TableBorderPropertyFlags = 0;
	type: TableEntityBorderType = TableEntityBorderType.Single;

	constructor(edgeFlags: CellEdgeFlags) {
		this.edgeFlags = edgeFlags;
	}
}

export class CellContent {
	clone(): CellContent {
		const copy = new CellContent();
		copy.contentType = this.contentType;
		copy.cadValue = this.cadValue.clone();
		copy.format = this.format.clone();
		copy.attributes = this.attributes.map(attribute => attribute.clone());
		return copy;
	}
	private _owner: CadObject | null = null;
	get owner(): CadObject | null { return this._owner; }
	set owner(value: CadObject | null) { this._owner = value; this.format.owner = value; }
	attributes: TableAttribute[] = [];
	blockRecord: BlockRecord | null = null;
	contentType: TableCellContentType = TableCellContentType.Unknown;
	format: ContentFormat = new ContentFormat();
	cadValue: CadValue = new CadValue();
	field: Field | null = null;
}

export class CellStyle extends ContentFormat {
	override clone(): this {
		const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this) as this;
		for (const key of ['topBorder', 'rightBorder', 'bottomBorder', 'leftBorder', 'horizontalInsideBorder', 'verticalInsideBorder'] as const) copy[key] = this[key].clone();
		copy.owner = null;
		return copy;
	}
	override get owner(): CadObject | null { return super.owner; }
	override set owner(value: CadObject | null) {
		super.owner = value;
		for (const border of [this.topBorder, this.rightBorder, this.bottomBorder, this.leftBorder, this.horizontalInsideBorder, this.verticalInsideBorder]) border.owner = value;
	}
	backgroundColor: Color = Color.byBlock;
	bottomBorder: CellBorder = new CellBorder(CellEdgeFlags.Bottom);
	bottomMargin: number = 0;
	cellAlignment: CellAlignmentType = CellAlignmentType.None;
	contentColor: Color = Color.byBlock;
	contentLayoutFlags: TableCellContentLayoutFlags = 0;
	horizontalInsideBorder: CellBorder = new CellBorder(CellEdgeFlags.InsideHorizontal);
	horizontalMargin: number = 0.06;
	isFillColorOn: boolean = false;
	leftBorder: CellBorder = new CellBorder(CellEdgeFlags.Left);
	marginHorizontalSpacing: number = 0;
	marginOverrideFlags: MarginFlags = 0;
	marginVerticalSpacing: number = 0;
	name: string = '';
	rightBorder: CellBorder = new CellBorder(CellEdgeFlags.Right);
	rightMargin: number = 0;
	styleClass: CellStyleClass = CellStyleClass.Data;
	tableCellStylePropertyFlags: TableCellStylePropertyFlags = 0;
	textColor: Color = Color.byBlock;
	topBorder: CellBorder = new CellBorder(CellEdgeFlags.Top);
	cellStyleType: CellStyleType = CellStyleType.Unknown;
	verticalInsideBorder: CellBorder = new CellBorder(CellEdgeFlags.InsideVertical);
	verticalMargin: number = 0.06;
	id: number = 0;
}

export class TableComponent {
	clone(): this {
		const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this) as this;
		copy._owner = null;
		copy._cells = tableOwnedList(() => copy.owner);
		copy._cellStyleOverride = this.cellStyleOverride.clone();
		copy.cellStyle = this.cellStyle?.clone() ?? null;
		copy.customDataCollection = this.customDataCollection.map(item => item.clone());
		copy.cells.push(...this.cells.map(cell => cell.clone()));
		return copy;
	}
	protected _owner: CadObject | null = null;
	get owner(): CadObject | null { return this._owner; }
	set owner(value: CadObject | null) {
		this._owner = value;
		if (this.cellStyle) this.cellStyle.owner = value;
		this.cellStyleOverride.owner = value;
		for (const cell of this.cells) cell.owner = value;
	}
	cellStyle: CellStyle | null = null;
	private _cellStyleOverride = new CellStyle();
	get cellStyleOverride(): CellStyle { return this._cellStyleOverride; }
	set cellStyleOverride(value: CellStyle) { this._cellStyleOverride = value; value.owner = this.owner; }
	private _cells: TableEntityCell[] = tableOwnedList(() => this.owner);
	get cells(): TableEntityCell[] { return this._cells; }
	set cells(value: TableEntityCell[]) {
		if (value === this._cells) return;
		this._cells.length = 0; this._cells.push(...value);
	}
	customData: number = 0;
	customDataCollection: CustomDataEntry[] = [];
}

export class TableEntityCell {
	clone(): TableEntityCell {
		const copy = Object.assign(new TableEntityCell(), this);
		copy._owner = null;
		copy._contents = tableOwnedList(() => copy.owner);
		copy.styleOverride = this.styleOverride.clone();
		copy.attributes = this.attributes.map(item => item.clone());
		copy.customDataCollection = this.customDataCollection.map(item => item.clone());
		copy.geometry = this.geometry?.clone() ?? null;
		copy.geometryCollection = this.geometryCollection.map(item => item.clone());
		copy.value = null; copy.dataLink = null; copy.geometryReference = null;
		copy.contents.push(...this.contents.map(item => item.clone()));
		return copy;
	}
	private _owner: CadObject | null = null;
	get owner(): CadObject | null { return this._owner; }
	set owner(value: CadObject | null) {
		this._owner = value;
		this.styleOverride.owner = value;
		for (const content of this.contents) content.owner = value;
	}
	styleId: number = 0;
	dataLink: CadObject | null = null;
	linkedRowCount: number = 0;
	linkedColumnCount: number = 0;
	linkedDataFlags: number = 0;
	geometryFlags: number = 0;
	geometryWidth: number = 0;
	geometryHeight: number = 0;
	geometryReference: CadObject | null = null;
	geometryCollection: CellContentGeometry[] = [];
	attributes: TableAttribute[] = [];
	autoFit: boolean = false;
	blockScale: number = 0;
	borderHeight: number = 0;
	borderWidth: number = 0;

	get content(): CellContent | null {
		if (this.contents == null || this.hasMultipleContent) {
			return null;
		}
		return this.contents.length > 0 ? this.contents[0] : null;
	}

	private _contents: CellContent[] = tableOwnedList(() => this.owner);
	get contents(): CellContent[] { return this._contents; }
	set contents(value: CellContent[]) {
		if (value === this._contents) return;
		this._contents.length = 0; this._contents.push(...value);
	}
	customData: number = 0;
	customDataCollection: CustomDataEntry[] = [];
	edgeFlags: number = 0;
	geometry: CellContentGeometry | null = null;
	hasLinkedData: boolean = false;

	get hasMultipleContent(): boolean {
		return this.contents != null && this.contents.length > 1;
	}

	mergedValue: number = 0;
	rotation: number = 0;
	stateFlags: TableCellStateFlags = 0;
	styleOverride: CellStyle = new CellStyle();
	toolTip: string = '';
	type: CellType = CellType.Text;
	value: CadObject | null = null;
	virtualEdgeFlag: number = 0;
}

export class TableEntityColumn extends TableComponent {
	styleId: number = 0;
	name: string = '';
	width: number = 0;
}

export class TableEntityRow extends TableComponent {
	styleId: number = 0;
	height: number = 0;
}

export class BreakHeight {
	clone(): BreakHeight { return Object.assign(new BreakHeight(), this, { position: copyTablePoint(this.position) }); }
	position: XYZ = new XYZ(0, 0, 0);
	height: number = 0;
}

export class BreakData {
	clone(): BreakData { return Object.assign(new BreakData(), this, { heights: this.heights.map(item => item.clone()) }); }
	flags: BreakOptionFlags = BreakOptionFlags.None;
	flowDirection: BreakFlowDirection = BreakFlowDirection.Right;
	breakSpacing: number = 0;
	heights: BreakHeight[] = [];
}

export class BreakRowRange {
	clone(): BreakRowRange { return Object.assign(new BreakRowRange(), this, { position: copyTablePoint(this.position) }); }
	position: XYZ = new XYZ(0, 0, 0);
	startRowIndex: number = 0;
	endRowIndex: number = 0;
}

// === Main Class ===

export class TableEntity extends Insert {
	get columns(): TableEntityColumn[] {
		return this._content.columns;
	}

	horizontalDirection: XYZ = new XYZ(0, 0, 0);

	override get objectName(): string {
		return DxfFileToken.entityTable;
	}

	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	overrideBorderColor: boolean = false;

	overrideBorderLineWeight: boolean = false;

	overrideBorderVisibility: boolean = false;

	overrideFlag: boolean = false;

	get rows(): TableEntityRow[] {
		return this._content.rows;
	}

	get style(): TableStyle | null {
		return this._content.style;
	}
	set style(value: TableStyle | null) {
		this._content.style = value;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.tableEntity;
	}

	valueFlag: number = 0;

	version: number = 0;
	hasBreakData: boolean = false;

	breakRowRanges: BreakRowRange[] = [];

	get content(): TableContent { return this._content; }

	get cellStyleOverride(): CellStyle { return this._content.cellStyleOverride; }

	get mergedCellRanges(): CellRange[] { return this._content.mergedCellRanges; }

	tableBreakData: BreakData = new BreakData();

	private _content: TableContent = new TableContent();

	override clone(): CadObject {
		return super.clone();
	}

	override getBoundingBox(): BoundingBox | null {
		return null;
	}

	getCell(row: number, column: number): TableEntityCell {
		return this.rows[row].cells[column];
	}
}

export class TableContent extends CadObject {
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get objectName(): string { return DxfFileToken.objectTableContent; }
	override get subclassMarker(): string { return DxfSubclassMarker.tableContent; }
	name: string = '';
	description: string = '';
	fieldReferences: CadObject[] = [];
	columns: TableEntityColumn[] = tableOwnedList(() => this);
	rows: TableEntityRow[] = tableOwnedList(() => this);
	style: TableStyle | null = null;
	cellStyleOverride: CellStyle = new CellStyle();
	mergedCellRanges: CellRange[] = [];
}
