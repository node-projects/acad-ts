import { EvaluationExpression } from './EvaluationExpression.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export abstract class BlockElement extends EvaluationExpression {
	override get subclassMarker(): string { return DxfSubclassMarker.BlockElement; }

	elementName: string = '';
	value1071: number = 0;
}
