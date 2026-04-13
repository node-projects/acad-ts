import { CadObject } from '../../CadObject.js';
import { ICadObjectTemplate } from './ICadObjectTemplate.js';

export interface ICadDictionaryTemplate extends ICadObjectTemplate {
	CadObject: CadObject;
}
