import { BlockRotationParameter } from '../../Objects/Evaluations/BlockRotationParameter.js';
import { CadBlock2PtParameterTemplate } from './CadBlock2PtParameterTemplate.js';

export class CadBlockRotationParameterTemplate extends CadBlock2PtParameterTemplate {
	constructor(cadObject?: BlockRotationParameter) {
		super(cadObject ?? new BlockRotationParameter());
	}
}
