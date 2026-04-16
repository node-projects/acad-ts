import { UnderlayEntity } from '../../Entities/UnderlayEntity.js';
import { UnderlayDefinition } from '../../Objects/UnderlayDefinition.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadUnderlayTemplate<T extends UnderlayDefinition = UnderlayDefinition> extends CadEntityTemplate {
	definitionHandle: number | null = null;

	constructor(entity: UnderlayEntity) {
		super(entity);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const underlay = this.cadObject as UnderlayEntity;

		const definition = builder.tryGetCadObject<T>(this.definitionHandle);
		if (definition) {
			underlay.definition = definition;
		} else {
			builder.notify(`UnderlayDefinition not found for ${this.cadObject.handle}`, NotificationType.Warning);
		}
	}
}
