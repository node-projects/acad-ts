import { EvaluationExpression } from '../../Objects/Evaluations/EvaluationExpression.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadEvaluationExpressionTemplate extends CadTemplateT<EvaluationExpression> {
	constructor(cadObject: EvaluationExpression) {
		super(cadObject);
	}
}
