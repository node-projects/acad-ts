import { BlockFlipAction } from '../../Objects/Evaluations/BlockFlipAction.js';
import { CadBlockActionTemplate } from './CadBlockActionTemplate.js';

export class CadBlockFlipActionTemplate extends CadBlockActionTemplate {
	get BlockFlipAction(): BlockFlipAction { return this.CadObject as BlockFlipAction; }

	constructor(cadObject: BlockFlipAction) {
		super(cadObject);
	}
}
