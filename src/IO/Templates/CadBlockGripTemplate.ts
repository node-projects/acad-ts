import { BlockGrip } from '../../Objects/Evaluations/BlockGrip.js';
import { CadBlockElementTemplate } from './CadBlockElementTemplate.js';

export abstract class CadBlockGripTemplate extends CadBlockElementTemplate {
	constructor(grip: BlockGrip) {
		super(grip);
	}
}
