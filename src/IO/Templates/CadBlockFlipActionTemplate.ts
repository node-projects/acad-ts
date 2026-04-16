import { BlockFlipAction } from '../../Objects/Evaluations/BlockFlipAction.js';
import { CadBlockActionTemplate } from './CadBlockActionTemplate.js';

export class CadBlockFlipActionTemplate extends CadBlockActionTemplate {
	get blockFlipAction(): BlockFlipAction { return this.cadObject as BlockFlipAction; }

	constructor(cadObject: BlockFlipAction) {
		super(cadObject);
	}
}
