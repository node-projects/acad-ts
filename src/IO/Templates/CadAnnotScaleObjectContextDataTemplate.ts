import { AnnotScaleObjectContextData } from '../../Objects/AnnotScaleObjectContextData.js';
import { Scale } from '../../Objects/Scale.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadNonGraphicalObjectTemplate } from './CadNonGraphicalObjectTemplate.js';

export class CadAnnotScaleObjectContextDataTemplate extends CadNonGraphicalObjectTemplate {
	scaleHandle: number | null = null;

	constructor(cadObject: AnnotScaleObjectContextData) {
		super(cadObject);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const contextData = this.CadObject as AnnotScaleObjectContextData;
		const scale = builder.TryGetCadObject<Scale>(this.scaleHandle);
		if (scale) {
			contextData.scale = scale;
		}
	}
}
