import { Layer } from '../../Tables/Layer.js';
import { LineType } from '../../Tables/LineType.js';
import { Material } from '../../Objects/Material.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';

export class CadLayerTemplate extends CadTableEntryTemplate<Layer> {
	LayerControlHandle: number = 0;

	PlotStyleHandle: number = 0;

	MaterialHandle: number = 0;

	LineTypeHandle: number | null = null;

	LineTypeName: string | null = null;

	TrueColorName: string | null = null;

	constructor(entry?: Layer) {
		super(entry ?? new Layer());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const material = builder.TryGetCadObject<Material>(this.MaterialHandle);

		const lineType = this.getTableReference<LineType>(builder, this.LineTypeHandle, this.LineTypeName ?? '');
		if (lineType) {
			this.CadObject.lineType = lineType;
		} else {
			builder.Notify(`Linetype with handle ${this.LineTypeHandle} could not be found for layer ${this.CadObject.name}`, NotificationType.Warning);
		}
	}
}
