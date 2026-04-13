import { Entity } from '../../Entities/Entity.js';
import { TextStyle } from '../../Tables/TextStyle.js';
import { IText } from '../../Entities/IText.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadTextEntityTemplate extends CadEntityTemplate {
	StyleHandle: number | null = null;

	StyleName: string | null = null;

	constructor(entity: Entity) {
		super(entity);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const text = this.CadObject as unknown as IText;

		const style = this.getTableReference<TextStyle>(builder, this.StyleHandle, this.StyleName ?? '');
		if (style) {
			text.style = style;
		}
	}
}
