import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { CellStyle } from '../Entities/TableEntity.js';
import { TableFlowDirectionType } from './TableFlowDirectionType.js';
import { tableOwnedList } from '../Entities/TableOwnedList.js';
import type { CadObject } from '../CadObject.js';
import type { CadDocument } from '../CadDocument.js';

export class TableStyle extends NonGraphicalObject {
	static get default_(): TableStyle { return new TableStyle(TableStyle.defaultName); }

	private _cellStyles: CellStyle[] = tableOwnedList(() => this);
	get cellStyles(): CellStyle[] { return this._cellStyles; }
	set cellStyles(value: CellStyle[]) { if (value !== this._cellStyles) { this._cellStyles.length = 0; this._cellStyles.push(...value); } }
	private _dataCellStyle = TableStyle.createDefaultCellStyle('_Data', 3);
	get dataCellStyle(): CellStyle { return this._dataCellStyle; }
	set dataCellStyle(value: CellStyle) { if (value !== this._dataCellStyle) this._dataCellStyle.owner = null; this._dataCellStyle = value; value.owner = this; }
	description: string = '';
	flags: number = 0;
	flowDirection: TableFlowDirectionType = TableFlowDirectionType.Down;
	private _headerCellStyle = TableStyle.createDefaultCellStyle('_Header', 2);
	get headerCellStyle(): CellStyle { return this._headerCellStyle; }
	set headerCellStyle(value: CellStyle) { if (value !== this._headerCellStyle) this._headerCellStyle.owner = null; this._headerCellStyle = value; value.owner = this; }
	horizontalCellMargin: number = 0.06;

	override get objectName(): string { return DxfFileToken.objectTableStyle; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get subclassMarker(): string { return DxfSubclassMarker.tableStyle; }

	suppressHeaderRow: boolean = false;
	suppressTitle: boolean = false;
	private _tableCellStyle = TableStyle.createDefaultCellStyle('Table', 4);
	get tableCellStyle(): CellStyle { return this._tableCellStyle; }
	set tableCellStyle(value: CellStyle) { if (value !== this._tableCellStyle) this._tableCellStyle.owner = null; this._tableCellStyle = value; value.owner = this; }
	private _titleCellStyle = TableStyle.createDefaultCellStyle('_Title', 1);
	get titleCellStyle(): CellStyle { return this._titleCellStyle; }
	set titleCellStyle(value: CellStyle) { if (value !== this._titleCellStyle) this._titleCellStyle.owner = null; this._titleCellStyle = value; value.owner = this; }
	verticalCellMargin: number = 0.06;

	static readonly defaultName = 'Standard';

	constructor(name: string = '') {
		super(name);
		this.attachStyles();
	}

	private attachStyles(): void {
		for (const style of [this.dataCellStyle, this.headerCellStyle, this.titleCellStyle, this.tableCellStyle, ...this.cellStyles]) style.owner = this;
	}
	override assignDocument(document: CadDocument): void { super.assignDocument(document); this.attachStyles(); }
	override unassignDocument(): void {
		super.unassignDocument();
		for (const style of [this.dataCellStyle, this.headerCellStyle, this.titleCellStyle, this.tableCellStyle, ...this.cellStyles]) { style.owner = null; style.owner = this; }
	}
	override clone(): CadObject {
		const copy = super.clone() as TableStyle;
		copy._dataCellStyle = this.dataCellStyle.clone(); copy._headerCellStyle = this.headerCellStyle.clone();
		copy._titleCellStyle = this.titleCellStyle.clone(); copy._tableCellStyle = this.tableCellStyle.clone();
		copy._cellStyles = tableOwnedList(() => copy);
		copy._cellStyles.push(...this.cellStyles.map(style => style.clone()));
		copy.attachStyles();
		return copy;
	}

	static createDefaultCellStyle(name: string, id: number): CellStyle {
		const style = new CellStyle();
		style.name = name;
		style.id = id;
		style.hasData = true;
		return style;
	}
}

export { TableFlowDirectionType } from './TableFlowDirectionType.js';
