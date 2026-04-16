import { AttributeBase } from '../../Entities/AttributeBase.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTextEntityTemplate } from './CadTextEntityTemplate.js';

export class CadAttributeTemplate extends CadTextEntityTemplate {
	mTextTemplate: CadTextEntityTemplate | null = null;

	constructor(entity: AttributeBase) {
		super(entity);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		if (this.mTextTemplate !== null) {
			this.mTextTemplate.build(builder);
		}
	}
}
