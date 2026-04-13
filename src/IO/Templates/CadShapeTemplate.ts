import { Shape } from '../../Entities/Shape.js';
import { TextStyle } from '../../Tables/TextStyle.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadShapeTemplate extends CadEntityTemplate {
	ShapeIndex: number | null = null;

	ShapeFileHandle: number | null = null;

	ShapeFileName: string | null = null;

	constructor(shape: Shape) {
		super(shape);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const shape = this.CadObject as Shape;

		const text = this.getTableReference<TextStyle>(builder, this.ShapeFileHandle, this.ShapeFileName ?? '');
		if (text) {
			if (text.isShapeFile) {
				shape.shapeStyle = text;
			} else {
				builder.Notify(`Shape style ${this.ShapeFileHandle} | ${this.ShapeFileName} not found`, NotificationType.Warning);
			}
		}
	}
}
