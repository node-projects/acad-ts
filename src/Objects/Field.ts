import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CadObject } from '../CadObject.js';
import { CadValue } from '../CadValue.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { EvaluationOptionFlags } from './EvaluationOptionFlags.js';
import { EvaluationStatusFlags } from './EvaluationStatusFlags.js';
import { FieldStateFlags } from './FieldStateFlags.js';
import { FilingOptionFlags } from './FilingOptionFlags.js';

export class Field extends NonGraphicalObject {
	cadObjects: CadObject[] = [];
	children: Field[] = [];
	evaluationErrorCode: number = 0;
	evaluationErrorMessage: string = '';
	evaluationOptionFlags: EvaluationOptionFlags = EvaluationOptionFlags.Never;
	evaluationStatusFlags: EvaluationStatusFlags = EvaluationStatusFlags.NotEvaluated;
	evaluatorId: string = '';
	fieldCode: string = '';
	fieldStateFlags: FieldStateFlags = FieldStateFlags.Unknown;
	filingOptionFlags: FilingOptionFlags = FilingOptionFlags.None;
	formatString: string = '';

	override get objectName(): string {
		return DxfFileToken.ObjectField;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.Field;
	}

	value: CadValue = new CadValue();
	values: Map<string, CadValue> = new Map();
}

export { EvaluationOptionFlags } from './EvaluationOptionFlags.js';

export { FilingOptionFlags } from './FilingOptionFlags.js';

export { FieldStateFlags } from './FieldStateFlags.js';

export { EvaluationStatusFlags } from './EvaluationStatusFlags.js';
