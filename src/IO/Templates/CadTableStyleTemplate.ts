import { TableStyle } from '../../Objects/TableStyle.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplate } from './CadTemplate.js';
import { CadCellStyleTemplate } from './CadTableEntityTemplate.js';

export class CadTableStyleTemplate extends CadTemplate<TableStyle> {
	cellStyleTemplates: CadCellStyleTemplate[] = [];

	currentCellStyleTemplate!: CadCellStyleTemplate;

	constructor(tableStyle?: TableStyle) {
		super(tableStyle ?? new TableStyle());
	}

	createCurrentCellStyleTemplate(): CadCellStyleTemplate {
		this.currentCellStyleTemplate = new CadCellStyleTemplate();
		this.cellStyleTemplates.push(this.currentCellStyleTemplate);
		return this.currentCellStyleTemplate;
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);
		const tableStyle = this.cadObject as TableStyle;

		for (const item of this.cellStyleTemplates) {
			tableStyle.cellStyles.push(item.cellStyle);
		}
	}
}
