import { Entity } from '../../Entities/Entity.js';
import { TextStyle } from '../../Tables/TextStyle.js';
import { IText } from '../../Entities/IText.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadTextEntityTemplate extends CadEntityTemplate {
	styleHandle: number | null = null;

	styleName: string | null = null;

	constructor(entity: Entity) {
		super(entity);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const text = this.cadObject as unknown as IText;

		const style = this.getTableReference<TextStyle>(builder, this.styleHandle, this.styleName ?? '');
		if (style) {
			text.style = style;
		}
	}
}
