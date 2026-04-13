import { BlockRotationAction } from '../../Objects/Evaluations/BlockRotationAction.js';
import { CadBlockActionBasePtTemplate } from './CadBlockActionBasePtTemplate.js';

export class CadBlockRotationActionTemplate extends CadBlockActionBasePtTemplate {
	constructor(blockAction?: BlockRotationAction) {
		super(blockAction ?? new BlockRotationAction());
	}
}
