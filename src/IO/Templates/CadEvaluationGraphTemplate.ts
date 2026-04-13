import { EvaluationExpression } from '../../Objects/Evaluations/EvaluationExpression.js';
import { EvaluationGraph , EvaluationGraphNode} from '../../Objects/Evaluations/EvaluationGraph.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
import { ICadTemplate } from './ICadTemplate.js';

export class CadEvaluationGraphTemplate extends CadTemplateT<EvaluationGraph> {
	NodeTemplates: CadEvaluationGraphTemplate.GraphNodeTemplate[] = [];

	constructor(evaluationGraph?: EvaluationGraph) {
		super(evaluationGraph ?? new EvaluationGraph());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		for (const item of this.NodeTemplates) {
			item.Build(builder);
			this.CadObject.nodes.push(item.Node);
		}
	}
}

export namespace CadEvaluationGraphTemplate {
	export class GraphNodeTemplate implements ICadTemplate {
		Node: EvaluationGraphNode = new EvaluationGraphNode();

		ExpressionHandle: number | null = null;

		Build(builder: CadDocumentBuilder): void {
			const evExpression = builder.TryGetCadObject<EvaluationExpression>(this.ExpressionHandle);
			if (evExpression) {
				this.Node.expression = evExpression;
			} else {
				builder.Notify(`Evaluation graph couldn't find the EvaluationExpression with handle ${this.ExpressionHandle}`, NotificationType.Warning);
			}
		}
	}
}
