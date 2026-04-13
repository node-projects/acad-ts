import { UnderlayEntity } from '../../Entities/UnderlayEntity.js';
import { UnderlayDefinition } from '../../Objects/UnderlayDefinition.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadUnderlayTemplate<T extends UnderlayDefinition = any> extends CadEntityTemplate {
	DefinitionHandle: number | null = null;

	constructor(entity: UnderlayEntity) {
		super(entity);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const underlay = this.CadObject as UnderlayEntity;

		const definition = builder.TryGetCadObject<T>(this.DefinitionHandle);
		if (definition) {
			underlay.definition = definition;
		} else {
			builder.Notify(`UnderlayDefinition not found for ${this.CadObject.handle}`, NotificationType.Warning);
		}
	}
}
