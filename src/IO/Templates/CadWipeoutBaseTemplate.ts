import { CadWipeoutBase } from '../../Entities/CadWipeoutBase.js';
import { ImageDefinition } from '../../Objects/ImageDefinition.js';
import { ImageDefinitionReactor } from '../../Objects/ImageDefinitionReactor.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadWipeoutBaseTemplate extends CadEntityTemplate {
	ImgDefHandle: number | null = null;

	ImgReactorHandle: number | null = null;

	constructor(image: CadWipeoutBase) {
		super(image);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const image = this.CadObject as CadWipeoutBase;

		const imgDef = builder.TryGetCadObject<ImageDefinition>(this.ImgDefHandle);
		if (imgDef) {
			image.definition = imgDef;
		}

		const imgReactor = builder.TryGetCadObject<ImageDefinitionReactor>(this.ImgReactorHandle);
		if (imgReactor) {
			image.definitionReactor = imgReactor;
		}
	}
}
