import { Block2PtParameter } from '../../Objects/Evaluations/Block2PtParameter.js';
import { CadBlockParameterTemplate } from './CadBlockParameterTemplate.js';

export class CadBlock2PtParameterTemplate extends CadBlockParameterTemplate {
	get block2PtParameter(): Block2PtParameter { return this.CadObject as Block2PtParameter; }

	constructor(cadObject: Block2PtParameter) {
		super(cadObject);
	}
}
