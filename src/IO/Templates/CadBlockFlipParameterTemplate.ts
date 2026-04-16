import { BlockFlipParameter } from '../../Objects/Evaluations/BlockFlipParameter.js';
import { CadBlock2PtParameterTemplate } from './CadBlock2PtParameterTemplate.js';

export class CadBlockFlipParameterTemplate extends CadBlock2PtParameterTemplate {
	get blockFlipParameter(): BlockFlipParameter { return this.cadObject as BlockFlipParameter; }

	constructor(cadObject: BlockFlipParameter) {
		super(cadObject);
	}
}
