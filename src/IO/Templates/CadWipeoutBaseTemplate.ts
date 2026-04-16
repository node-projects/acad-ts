import { CadWipeoutBase } from '../../Entities/CadWipeoutBase.js';
import { ImageDefinition } from '../../Objects/ImageDefinition.js';
import { ImageDefinitionReactor } from '../../Objects/ImageDefinitionReactor.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadWipeoutBaseTemplate extends CadEntityTemplate {
	imgDefHandle: number | null = null;

	imgReactorHandle: number | null = null;

	constructor(image: CadWipeoutBase) {
		super(image);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const image = this.cadObject as CadWipeoutBase;

		const imgDef = builder.tryGetCadObject<ImageDefinition>(this.imgDefHandle);
		if (imgDef) {
			image.definition = imgDef;
		}

		const imgReactor = builder.tryGetCadObject<ImageDefinitionReactor>(this.imgReactorHandle);
		if (imgReactor) {
			image.definitionReactor = imgReactor;
			imgReactor.image = image;
			imgReactor.owner = image;
			builder.documentToBuild.registerCollection(imgReactor);
		}
	}
}
