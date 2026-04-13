import { Tolerance } from '../../Entities/Tolerance.js';
import { DimensionStyle } from '../../Tables/DimensionStyle.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadToleranceTemplate extends CadEntityTemplate {
	DimensionStyleHandle: number | null = null;

	DimensionStyleName: string | null = null;

	constructor(tolerance?: Tolerance) {
		super(tolerance ?? new Tolerance());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const style = this.getTableReference<DimensionStyle>(builder, this.DimensionStyleHandle, this.DimensionStyleName);
		if (style) {
			(this.CadObject as Tolerance).style = style;
		}
	}
}
