import { Entity } from '../../Entities/Entity.js';
import { BookColor } from '../../Objects/BookColor.js';
import { Layer } from '../../Tables/Layer.js';
import { LineType } from '../../Tables/LineType.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadEntityTemplate extends CadTemplateT<Entity> {
	bookColorName: string | null = null;

	ColorHandle: number | null = null;

	EntityMode: number = 0;

	LayerHandle: number | null = null;

	LayerName: string | null = null;

	LineTypeHandle: number | null = null;

	LineTypeName: string | null = null;

	LtypeFlags: number | null = null;

	MaterialHandle: number | null = null;

	NextEntity: number | null = null;

	PrevEntity: number | null = null;

	constructor(entity: Entity) {
		super(entity);
	}

	SetUnlinkedReferences(): void {
		if (this.LayerName && this.LayerName.length > 0) {
			this.CadObject.layer = new Layer(this.LayerName);
		}

		if (this.LineTypeName && this.LineTypeName.length > 0) {
			this.CadObject.lineType = new LineType(this.LineTypeName);
		}
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const layer = this.getTableReference<Layer>(builder, this.LayerHandle, this.LayerName ?? '');
		if (layer) {
			this.CadObject.layer = layer;
		}

		switch (this.LtypeFlags) {
			case 0:
				this.LineTypeName = LineType.ByLayerName;
				break;
			case 1:
				this.LineTypeName = LineType.ByBlockName;
				break;
			case 2:
				this.LineTypeName = LineType.ContinuousName;
				break;
		}

		const ltype = this.getTableReference<LineType>(builder, this.LineTypeHandle, this.LineTypeName ?? '');
		if (ltype) {
			this.CadObject.lineType = ltype;
		}

		const color = builder.TryGetCadObject<BookColor>(this.ColorHandle);
		if (color) {
			this.CadObject.bookColor = color;
		} else if (this.bookColorName && this.bookColorName.length > 0 &&
			builder.DocumentToBuild != null &&
			builder.DocumentToBuild.colors != null) {
			const bookColor = builder.DocumentToBuild.colors.TryGet(this.bookColorName);
			if (bookColor) {
				this.CadObject.bookColor = bookColor;
			}
		}
	}
}

export class CadEntityTemplateT<T extends Entity = any> extends CadEntityTemplate {
	declare CadObject: T;

	constructor(entity: T) {
		super(entity);
	}
}
