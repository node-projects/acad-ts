import { EvaluationExpression } from '../../Objects/Evaluations/EvaluationExpression.js';
import { EvaluationGraph , EvaluationGraphNode} from '../../Objects/Evaluations/EvaluationGraph.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadEvaluationGraphTemplate extends CadTemplateT<EvaluationGraph> {
	nodeTemplates: CadEvaluationGraphTemplate.GraphNodeTemplate[] = [];

	constructor(evaluationGraph?: EvaluationGraph) {
		super(evaluationGraph ?? new EvaluationGraph());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		for (const item of this.nodeTemplates) {
			item.build(builder);
			this.cadObject.nodes.push(item.node);
		}
	}
}

export namespace CadEvaluationGraphTemplate {
	export class GraphNodeTemplate implements ICadTemplate {
		node: EvaluationGraphNode = new EvaluationGraphNode();

		expressionHandle: number | null = null;

		build(builder: CadDocumentBuilder): void {
			const evExpression = builder.tryGetCadObject<EvaluationExpression>(this.expressionHandle);
			if (evExpression) {
				this.node.expression = evExpression;
			} else {
				builder.notify(`Evaluation graph couldn't find the EvaluationExpression with handle ${this.expressionHandle}`, NotificationType.Warning);
			}
		}
	}
}
