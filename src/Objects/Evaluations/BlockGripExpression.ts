import { EvaluationExpression } from './EvaluationExpression.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockGripExpression extends EvaluationExpression {
	override get objectName(): string { return DxfFileToken.ObjectBlockGripLocationComponent; }
	override get subclassMarker(): string { return DxfSubclassMarker.BlockGripExpression; }

	value300: string = '';
	value91: number = 0;
}
