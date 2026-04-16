import { CadObject } from '../../CadObject.js';
import { TableEntity, TableEntityCell, CellType, CellContent, CellStyle, CellBorder, ContentFormat, TableAttribute } from '../../Entities/TableEntity.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadInsertTemplate } from './CadInsertTemplate.js';
import { CadValueTemplate } from './CadValueTemplate.js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadTableEntityTemplate extends CadInsertTemplate {
	blockOwnerHandle: number | null = null;

	cadTableCellTemplates: CadTableCellTemplate[] = [];

	get currentCell(): TableEntityCell { return this.currentCellTemplate.cell; }

	currentCellTemplate!: CadTableCellTemplate;

	horizontalMargin: number | null = null;

	nullHandle: number | null = null;

	styleHandle: number | null = null;

	get tableEntity(): TableEntity { return this.cadObject as TableEntity; }

	private _currCellIndex: number = 0;

	constructor(table?: TableEntity) {
		super(table ?? new TableEntity());
	}

	createCell(type: CellType): void {
		const rowIndex = Math.floor(this._currCellIndex / this.tableEntity.columns.length);

		const cell = new TableEntityCell();
		cell.type = type;

		this.tableEntity.rows[rowIndex].cells.push(cell);

		this.currentCellTemplate = new CadTableCellTemplate(cell);

		this.cadTableCellTemplates.push(this.currentCellTemplate);

		this._currCellIndex++;
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		for (const cellTemplate of this.cadTableCellTemplates) {
			cellTemplate.build(builder);
		}
	}
}

export class CadTableCellContentFormatTemplate implements ICadTemplate {
	format: ContentFormat;

	textStyleHandle: number | null = null;

	textStyleName: string | null = null;

	constructor(format: ContentFormat) {
		this.format = format;
	}

	build(builder: CadDocumentBuilder): void {
		throw new Error('Not implemented');
	}
}

export class CadCellStyleTemplate extends CadTableCellContentFormatTemplate {
	borderLinetypePairs: [CellBorder, number][] = [];

	get cellStyle(): CellStyle { return this.format as CellStyle; }

	textStyleHandle: number | null = null;

	constructor(style?: CellStyle) {
		super(style ?? new CellStyle());
	}
}

export class CadTableAttributeTemplate implements ICadTemplate {
	attDefHandle: number | null = null;

	private _tableAtt: TableAttribute;

	constructor(tableAtt: TableAttribute) {
		this._tableAtt = tableAtt;
	}

	build(builder: CadDocumentBuilder): void {
		throw new Error('Not implemented');
	}
}

export class CadTableCellContentTemplate implements ICadTemplate {
	blockRecordHandle: number | null = null;

	cadValueTemplate: CadValueTemplate | null = null;

	content: CellContent;

	fieldHandle: number | null = null;

	constructor(content: CellContent) {
		this.content = content;
	}

	build(builder: CadDocumentBuilder): void {
		throw new Error('Not implemented');
	}
}

export class CadTableCellTemplate implements ICadTemplate {
	attributeHandles: Set<[number, string]> = new Set();

	cell: TableEntityCell;

	contentTemplates: CadTableCellContentTemplate[] = [];

	formatTextHeight: number | null = null;

	styleId: number = 0;

	textStyleOverrideHandle: number | null = null;

	unknownHandle: number | null = null;

	valueHandle: number | null = null;

	constructor(cell: TableEntityCell) {
		this.cell = cell;
	}

	build(builder: CadDocumentBuilder): void {
		const cadObject = builder.tryGetCadObject<CadObject>(this.valueHandle);
	}
}
