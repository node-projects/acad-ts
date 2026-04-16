import { Block1PtParameter } from '../../Objects/Evaluations/Block1PtParameter.js';
import { CadBlockParameterTemplate } from './CadBlockParameterTemplate.js';

export class CadBlock1PtParameterTemplate extends CadBlockParameterTemplate {
	get block1PtParameter(): Block1PtParameter { return this.cadObject as Block1PtParameter; }

	constructor(cadObject: Block1PtParameter) {
		super(cadObject);
	}
}
