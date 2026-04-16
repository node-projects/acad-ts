import { EvaluationExpression } from './EvaluationExpression.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockGripExpression extends EvaluationExpression {
	override get objectName(): string { return DxfFileToken.objectBlockGripLocationComponent; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockGripExpression; }

	value300: string = '';
	value91: number = 0;
}
