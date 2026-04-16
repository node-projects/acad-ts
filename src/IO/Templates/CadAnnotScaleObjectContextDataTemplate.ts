import { AnnotScaleObjectContextData } from '../../Objects/AnnotScaleObjectContextData.js';
import { Scale } from '../../Objects/Scale.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadNonGraphicalObjectTemplate } from './CadNonGraphicalObjectTemplate.js';

export class CadAnnotScaleObjectContextDataTemplate extends CadNonGraphicalObjectTemplate {
	scaleHandle: number | null = null;

	constructor(cadObject: AnnotScaleObjectContextData) {
		super(cadObject);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const contextData = this.cadObject as AnnotScaleObjectContextData;
		const scale = builder.tryGetCadObject<Scale>(this.scaleHandle);
		if (scale) {
			contextData.scale = scale;
		}
	}
}
