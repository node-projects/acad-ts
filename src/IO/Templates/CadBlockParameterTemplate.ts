import { BlockParameter } from '../../Objects/Evaluations/BlockParameter.js';
import { CadBlockElementTemplate } from './CadBlockElementTemplate.js';

export class CadBlockParameterTemplate extends CadBlockElementTemplate {
	get blockParameter(): BlockParameter { return this.cadObject as BlockParameter; }

	constructor(cadObject: BlockParameter) {
		super(cadObject);
	}
}
