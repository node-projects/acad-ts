import { CadObject } from '../../CadObject.js';
import { Entity } from '../../Entities/Entity.js';
import { BlockVisibilityParameter } from '../../Objects/Evaluations/BlockVisibilityParameter.js';
import { BlockVisibilityState } from '../../Objects/Evaluations/BlockVisibilityParameter.js';
import { EvaluationExpression } from '../../Objects/Evaluations/EvaluationExpression.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadBlock1PtParameterTemplate } from './CadBlock1PtParameterTemplate.js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadBlockVisibilityParameterTemplate extends CadBlock1PtParameterTemplate {
	entityHandles: number[] = [];

	StateTemplates: CadBlockVisibilityParameterTemplate.StateTemplate[] = [];

	constructor(cadObject?: BlockVisibilityParameter) {
		super(cadObject ?? new BlockVisibilityParameter());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const bvp = this.CadObject as BlockVisibilityParameter;

		for (const handle of this.entityHandles) {
			const entity = builder.TryGetCadObject<Entity>(handle);
			if (entity) {
				bvp.entities.push(entity);
			} else {
				builder.Notify(`[${bvp.toString()}] entity with handle ${handle} not found.`);
			}
		}

		for (const item of this.StateTemplates) {
			item.Build(builder, this.entityHandles);
			bvp.addState(item.state);
		}
	}
}

export namespace CadBlockVisibilityParameterTemplate {
	export class StateTemplate {
		state: BlockVisibilityState = new BlockVisibilityState();

		entityHandles: Set<number> = new Set();

		expressionHandles: Set<number> = new Set();

		constructor(state?: BlockVisibilityState) {
			if (state) {
				this.state = state;
			}
		}

		Build(builder: CadDocumentBuilder, parentEntityHandles: number[]): void {
			this.setEntities<Entity>(builder, this.state.entities, this.entityHandles, parentEntityHandles);
			this.setEntities<EvaluationExpression>(builder, this.state.expressions, this.expressionHandles, null);
		}

		private setEntities<T extends CadObject>(builder: CadDocumentBuilder, subset: T[], handles: Set<number>, entities: number[] | null): void {
			for (const h of handles) {
				if (entities !== null && !entities.includes(h)) {
					builder.Notify(`[${this.state.toString()}] parent does not contain handle ${h}.`);
				}

				const obj = builder.TryGetCadObject<T>(h);
				if (obj) {
					subset.push(obj);
				} else {
					builder.Notify(`[${this.state.toString()}] object with handle ${h} not found.`);
				}
			}
		}
	}
}
