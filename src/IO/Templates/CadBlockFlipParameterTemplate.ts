import { BlockFlipParameter } from '../../Objects/Evaluations/BlockFlipParameter.js';
import { CadBlock2PtParameterTemplate } from './CadBlock2PtParameterTemplate.js';

export class CadBlockFlipParameterTemplate extends CadBlock2PtParameterTemplate {
	get BlockFlipParameter(): BlockFlipParameter { return this.CadObject as BlockFlipParameter; }

	constructor(cadObject: BlockFlipParameter) {
		super(cadObject);
	}
}
