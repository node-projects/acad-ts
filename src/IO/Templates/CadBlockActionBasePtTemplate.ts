import { BlockActionBasePt } from '../../Objects/Evaluations/BlockActionBasePt.js';
import { CadBlockActionTemplate } from './CadBlockActionTemplate.js';

export abstract class CadBlockActionBasePtTemplate extends CadBlockActionTemplate {
	constructor(blockAction: BlockActionBasePt) {
		super(blockAction);
	}
}
