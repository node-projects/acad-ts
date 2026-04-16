import { Layer } from '../../Tables/Layer.js';
import { LineType } from '../../Tables/LineType.js';
import { Material } from '../../Objects/Material.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';

export class CadLayerTemplate extends CadTableEntryTemplate<Layer> {
	layerControlHandle: number = 0;

	plotStyleHandle: number = 0;

	materialHandle: number = 0;

	lineTypeHandle: number | null = null;

	lineTypeName: string | null = null;

	trueColorName: string | null = null;

	constructor(entry?: Layer) {
		super(entry ?? new Layer());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const material = builder.tryGetCadObject<Material>(this.materialHandle);

		const lineType = this.getTableReference<LineType>(builder, this.lineTypeHandle, this.lineTypeName ?? '');
		if (lineType) {
			this.cadObject.lineType = lineType;
		} else {
			builder.notify(`Linetype with handle ${this.lineTypeHandle} could not be found for layer ${this.cadObject.name}`, NotificationType.Warning);
		}
	}
}
