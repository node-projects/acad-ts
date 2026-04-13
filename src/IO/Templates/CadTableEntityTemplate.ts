import { CadObject } from '../../CadObject.js';
import { TableEntity, TableEntityCell, CellType, CellContent, CellStyle, CellBorder, ContentFormat, TableAttribute } from '../../Entities/TableEntity.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadInsertTemplate } from './CadInsertTemplate.js';
import { CadValueTemplate } from './CadValueTemplate.js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadTableEntityTemplate extends CadInsertTemplate {
	BlockOwnerHandle: number | null = null;

	cadTableCellTemplates: CadTableCellTemplate[] = [];

	get CurrentCell(): TableEntityCell { return this.CurrentCellTemplate.Cell; }

	CurrentCellTemplate!: CadTableCellTemplate;

	HorizontalMargin: number | null = null;

	NullHandle: number | null = null;

	styleHandle: number | null = null;

	get TableEntity(): TableEntity { return this.CadObject as TableEntity; }

	private _currCellIndex: number = 0;

	constructor(table?: TableEntity) {
		super(table ?? new TableEntity());
	}

	CreateCell(type: CellType): void {
		const rowIndex = Math.floor(this._currCellIndex / this.TableEntity.columns.length);

		const cell = new TableEntityCell();
		cell.type = type;

		this.TableEntity.rows[rowIndex].cells.push(cell);

		this.CurrentCellTemplate = new CadTableCellTemplate(cell);

		this.cadTableCellTemplates.push(this.CurrentCellTemplate);

		this._currCellIndex++;
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		for (const cellTemplate of this.cadTableCellTemplates) {
			cellTemplate.Build(builder);
		}
	}
}

export class CadTableCellContentFormatTemplate implements ICadTemplate {
	Format: ContentFormat;

	TextStyleHandle: number | null = null;

	TextStyleName: string | null = null;

	constructor(format: ContentFormat) {
		this.Format = format;
	}

	Build(builder: CadDocumentBuilder): void {
		throw new Error('Not implemented');
	}
}

export class CadCellStyleTemplate extends CadTableCellContentFormatTemplate {
	BorderLinetypePairs: [CellBorder, number][] = [];

	get CellStyle(): CellStyle { return this.Format as CellStyle; }

	textStyleHandle: number | null = null;

	constructor(style?: CellStyle) {
		super(style ?? new CellStyle());
	}
}

export class CadTableAttributeTemplate implements ICadTemplate {
	AttDefHandle: number | null = null;

	private _tableAtt: TableAttribute;

	constructor(tableAtt: TableAttribute) {
		this._tableAtt = tableAtt;
	}

	Build(builder: CadDocumentBuilder): void {
		throw new Error('Not implemented');
	}
}

export class CadTableCellContentTemplate implements ICadTemplate {
	BlockRecordHandle: number | null = null;

	CadValueTemplate: CadValueTemplate | null = null;

	Content: CellContent;

	FieldHandle: number | null = null;

	constructor(content: CellContent) {
		this.Content = content;
	}

	Build(builder: CadDocumentBuilder): void {
		throw new Error('Not implemented');
	}
}

export class CadTableCellTemplate implements ICadTemplate {
	AttributeHandles: Set<[number, string]> = new Set();

	Cell: TableEntityCell;

	ContentTemplates: CadTableCellContentTemplate[] = [];

	FormatTextHeight: number | null = null;

	StyleId: number = 0;

	TextStyleOverrideHandle: number | null = null;

	UnknownHandle: number | null = null;

	ValueHandle: number | null = null;

	constructor(cell: TableEntityCell) {
		this.Cell = cell;
	}

	Build(builder: CadDocumentBuilder): void {
		const cadObject = builder.TryGetCadObject<CadObject>(this.ValueHandle);
	}
}
