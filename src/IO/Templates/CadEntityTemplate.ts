import { Entity } from '../../Entities/Entity.js';
import { BookColor } from '../../Objects/BookColor.js';
import { Layer } from '../../Tables/Layer.js';
import { LineType } from '../../Tables/LineType.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadEntityTemplate extends CadTemplateT<Entity> {
	bookColorName: string | null = null;

	colorHandle: number | null = null;

	entityMode: number = 0;

	layerHandle: number | null = null;

	layerName: string | null = null;

	lineTypeHandle: number | null = null;

	lineTypeName: string | null = null;

	ltypeFlags: number | null = null;

	materialHandle: number | null = null;

	nextEntity: number | null = null;

	prevEntity: number | null = null;

	constructor(entity: Entity) {
		super(entity);
	}

	setUnlinkedReferences(): void {
		if (this.layerName && this.layerName.length > 0) {
			this.cadObject.layer = new Layer(this.layerName);
		}

		if (this.lineTypeName && this.lineTypeName.length > 0) {
			this.cadObject.lineType = new LineType(this.lineTypeName);
		}
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const layer = this.getTableReference<Layer>(builder, this.layerHandle, this.layerName ?? '');
		if (layer) {
			this.cadObject.layer = layer;
		}

		switch (this.ltypeFlags) {
			case 0:
				this.lineTypeName = LineType.byLayerName;
				break;
			case 1:
				this.lineTypeName = LineType.byBlockName;
				break;
			case 2:
				this.lineTypeName = LineType.continuousName;
				break;
		}

		const ltype = this.getTableReference<LineType>(builder, this.lineTypeHandle, this.lineTypeName ?? '');
		if (ltype) {
			this.cadObject.lineType = ltype;
		}

		const color = builder.tryGetCadObject<BookColor>(this.colorHandle);
		if (color) {
			this.cadObject.bookColor = color;
		} else if (this.bookColorName && this.bookColorName.length > 0 &&
			builder.documentToBuild != null &&
			builder.documentToBuild.colors != null) {
			const bookColor = builder.documentToBuild.colors.tryGet(this.bookColorName);
			if (bookColor) {
				this.cadObject.bookColor = bookColor;
			}
		}
	}
}

export class CadEntityTemplateT<T extends Entity = Entity> extends CadEntityTemplate {
	declare cadObject: T;

	constructor(entity: T) {
		super(entity);
	}
}
