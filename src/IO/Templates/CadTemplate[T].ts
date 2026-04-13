import { CadObject } from '../../CadObject.js';
import { CadTemplate } from './CadTemplate.js';

export class CadTemplateT<T extends CadObject> extends CadTemplate {
	declare CadObject: T;

	constructor(cadObject: T) {
		super(cadObject);
	}
}
