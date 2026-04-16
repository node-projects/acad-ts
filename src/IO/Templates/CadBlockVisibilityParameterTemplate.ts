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

	stateTemplates: CadBlockVisibilityParameterTemplate.StateTemplate[] = [];

	constructor(cadObject?: BlockVisibilityParameter) {
		super(cadObject ?? new BlockVisibilityParameter());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const bvp = this.cadObject as BlockVisibilityParameter;

		for (const handle of this.entityHandles) {
			const entity = builder.tryGetCadObject<Entity>(handle);
			if (entity) {
				bvp.entities.push(entity);
			} else {
				builder.notify(`[${bvp.toString()}] entity with handle ${handle} not found.`);
			}
		}

		for (const item of this.stateTemplates) {
			item.build(builder, this.entityHandles);
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

		build(builder: CadDocumentBuilder, parentEntityHandles: number[]): void {
			this._setEntities<Entity>(builder, this.state.entities, this.entityHandles, parentEntityHandles);
			this._setEntities<EvaluationExpression>(builder, this.state.expressions, this.expressionHandles, null);
		}

		private _setEntities<T extends CadObject>(builder: CadDocumentBuilder, subset: T[], handles: Set<number>, entities: number[] | null): void {
			for (const h of handles) {
				if (entities !== null && !entities.includes(h)) {
					builder.notify(`[${this.state.toString()}] parent does not contain handle ${h}.`);
				}

				const obj = builder.tryGetCadObject<T>(h);
				if (obj) {
					subset.push(obj);
				} else {
					builder.notify(`[${this.state.toString()}] object with handle ${h} not found.`);
				}
			}
		}
	}
}
