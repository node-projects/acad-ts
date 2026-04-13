import { BlockGripExpression } from '../../Objects/Evaluations/BlockGripExpression.js';
import { CadEvaluationExpressionTemplate } from './CadEvaluationExpressionTemplate.js';

export class CadBlockGripExpressionTemplate extends CadEvaluationExpressionTemplate {
	constructor(grip?: BlockGripExpression) {
		super(grip ?? new BlockGripExpression());
	}
}
