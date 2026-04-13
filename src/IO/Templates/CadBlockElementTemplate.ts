import { BlockElement } from '../../Objects/Evaluations/BlockElement.js';
import { CadEvaluationExpressionTemplate } from './CadEvaluationExpressionTemplate.js';

export class CadBlockElementTemplate extends CadEvaluationExpressionTemplate {
	get blockElement(): BlockElement { return this.CadObject as BlockElement; }

	constructor(cadObject: BlockElement) {
		super(cadObject);
	}
}
