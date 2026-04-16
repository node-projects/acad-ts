import { Tolerance } from '../../Entities/Tolerance.js';
import { DimensionStyle } from '../../Tables/DimensionStyle.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadToleranceTemplate extends CadEntityTemplate {
	dimensionStyleHandle: number | null = null;

	dimensionStyleName: string | null = null;

	constructor(tolerance?: Tolerance) {
		super(tolerance ?? new Tolerance());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const style = this.getTableReference<DimensionStyle>(builder, this.dimensionStyleHandle, this.dimensionStyleName);
		if (style) {
			(this.cadObject as Tolerance).style = style;
		}
	}
}
