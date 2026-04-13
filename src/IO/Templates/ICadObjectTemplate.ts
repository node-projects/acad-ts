import { CadObject } from '../../CadObject.js';
import { ICadTemplate } from './ICadTemplate.js';

export interface ICadObjectTemplate extends ICadTemplate {
	CadObject: CadObject;
}
