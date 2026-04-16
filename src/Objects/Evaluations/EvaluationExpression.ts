import { CadObject } from '../../CadObject.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { ObjectType } from '../../Types/ObjectType.js';

export abstract class EvaluationExpression extends CadObject {
	id: number = 0;

	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get subclassMarker(): string { return DxfSubclassMarker.evalGraphExpr; }

	value98: number = 0;
	value99: number = 0;
}
