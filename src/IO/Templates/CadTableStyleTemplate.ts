import { TableStyle } from '../../Objects/TableStyle.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplate } from './CadTemplate.js';
import { CadCellStyleTemplate } from './CadTableEntityTemplate.js';

export class CadTableStyleTemplate extends CadTemplate<TableStyle> {
	CellStyleTemplates: CadCellStyleTemplate[] = [];

	CurrentCellStyleTemplate!: CadCellStyleTemplate;

	constructor(tableStyle?: TableStyle) {
		super(tableStyle ?? new TableStyle());
	}

	CreateCurrentCellStyleTemplate(): CadCellStyleTemplate {
		this.CurrentCellStyleTemplate = new CadCellStyleTemplate();
		this.CellStyleTemplates.push(this.CurrentCellStyleTemplate);
		return this.CurrentCellStyleTemplate;
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		for (const item of this.CellStyleTemplates) {
			(this.CadObject as any).cellStyles.push(item.CellStyle);
		}
	}
}
