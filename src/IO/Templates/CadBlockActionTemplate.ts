import { Entity } from '../../Entities/Entity.js';
import { BlockAction } from '../../Objects/Evaluations/BlockAction.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadBlockElementTemplate } from './CadBlockElementTemplate.js';

export class CadBlockActionTemplate extends CadBlockElementTemplate {
	get blockAction(): BlockAction { return this.CadObject as BlockAction; }

	entityHandles: Set<number> = new Set();

	constructor(cadObject: BlockAction) {
		super(cadObject);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		for (const handle of this.entityHandles) {
			const entity = builder.TryGetCadObject<Entity>(handle);
			if (entity) {
				this.blockAction.entities.push(entity);
			} else {
				builder.Notify(`[${this.blockAction.toString()}] entity with handle ${handle} not found.`);
			}
		}
	}
}
