import { BlockRotationGrip } from '../../Objects/Evaluations/BlockRotationGrip.js';
import { CadBlockGripTemplate } from './CadBlockGripTemplate.js';

export class CadBlockRotationGripTemplate extends CadBlockGripTemplate {
	constructor(grip?: BlockRotationGrip) {
		super(grip ?? new BlockRotationGrip());
	}
}
