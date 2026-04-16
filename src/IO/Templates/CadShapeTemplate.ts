import { Shape } from '../../Entities/Shape.js';
import { TextStyle } from '../../Tables/TextStyle.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadShapeTemplate extends CadEntityTemplate {
	shapeIndex: number | null = null;

	shapeFileHandle: number | null = null;

	shapeFileName: string | null = null;

	constructor(shape: Shape) {
		super(shape);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const shape = this.cadObject as Shape;

		const text = this.getTableReference<TextStyle>(builder, this.shapeFileHandle, this.shapeFileName ?? '');
		if (text) {
			if (text.isShapeFile) {
				shape.shapeStyle = text;
			} else {
				builder.notify(`Shape style ${this.shapeFileHandle} | ${this.shapeFileName} not found`, NotificationType.Warning);
			}
		}
	}
}
