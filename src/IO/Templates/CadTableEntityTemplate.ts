import { TableEntity, TableEntityCell, CellType, CellContent, CellStyle, CellBorder, ContentFormat, TableAttribute } from '../../Entities/TableEntity.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadInsertTemplate } from './CadInsertTemplate.js';
import { CadValueTemplate } from './CadValueTemplate.js';
import { ICadTemplate } from './ICadTemplate.js';
import { TextStyle } from '../../Tables/TextStyle.js';
import { LineType } from '../../Tables/LineType.js';
import { AttributeDefinition } from '../../Entities/AttributeDefinition.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { Field } from '../../Objects/Field.js';
import { CadObject } from '../../CadObject.js';
import type { TableStyle } from '../../Objects/TableStyle.js';
import type { CadTableStyleTemplate } from './CadTableStyleTemplate.js';

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
		const styleTemplate = builder.tryGetObjectTemplate<CadTableStyleTemplate>(this.styleHandle);
		if (styleTemplate) {
			styleTemplate.build(builder);
			this.tableEntity.style = styleTemplate.cadObject as TableStyle;
		} else {
			this.tableEntity.style = builder.tryGetCadObject<TableStyle>(this.styleHandle);
		}

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
		this.format.textStyle = builder.tryGetCadObject<TextStyle>(this.textStyleHandle)
			?? (this.textStyleName ? builder.tryGetTableEntry<TextStyle>(this.textStyleName) : null);
	}
}

export class CadCellStyleTemplate extends CadTableCellContentFormatTemplate {
	borderLinetypePairs: [CellBorder, number][] = [];

	get cellStyle(): CellStyle { return this.format as CellStyle; }

	textStyleHandle: number | null = null;

	constructor(style?: CellStyle) {
		super(style ?? new CellStyle());
	}

	override build(builder: CadDocumentBuilder): void {
		super.build(builder);
		for (const [border, handle] of this.borderLinetypePairs) {
			border.lineType = builder.tryGetCadObject<LineType>(handle);
		}
	}
}

export class CadTableAttributeTemplate implements ICadTemplate {
	attDefHandle: number | null = null;

	private _tableAtt: TableAttribute;

	constructor(tableAtt: TableAttribute) {
		this._tableAtt = tableAtt;
	}

	build(builder: CadDocumentBuilder): void {
		this._tableAtt.attributeDefinition = builder.tryGetCadObject<AttributeDefinition>(this.attDefHandle);
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
		this.cadValueTemplate?.build(builder);
		this.content.blockRecord = builder.tryGetCadObject<BlockRecord>(this.blockRecordHandle);
		this.content.field = builder.tryGetCadObject<Field>(this.fieldHandle);
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
		this.cell.value = builder.tryGetCadObject<CadObject>(this.valueHandle);
		for (const contentTemplate of this.contentTemplates) {
			contentTemplate.build(builder);
		}

		this.cell.styleOverride.textStyle = builder.tryGetCadObject<TextStyle>(this.textStyleOverrideHandle);
		if (this.formatTextHeight != null) {
			this.cell.styleOverride.textHeight = this.formatTextHeight;
		}

		for (const [handle, value] of this.attributeHandles) {
			const attribute = new TableAttribute();
			attribute.value = value;
			const template = new CadTableAttributeTemplate(attribute);
			template.attDefHandle = handle;
			template.build(builder);
			this.cell.attributes.push(attribute);
		}
	}
}
