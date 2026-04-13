import { AttributeBase } from '../../Entities/AttributeBase.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTextEntityTemplate } from './CadTextEntityTemplate.js';

export class CadAttributeTemplate extends CadTextEntityTemplate {
	MTextTemplate: CadTextEntityTemplate | null = null;

	constructor(entity: AttributeBase) {
		super(entity);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		if (this.MTextTemplate !== null) {
			this.MTextTemplate.Build(builder);
		}
	}
}
