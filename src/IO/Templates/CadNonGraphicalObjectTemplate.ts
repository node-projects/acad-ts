import { NonGraphicalObject } from '../../Objects/NonGraphicalObject.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadNonGraphicalObjectTemplate extends CadTemplateT<NonGraphicalObject> {
	constructor(obj: NonGraphicalObject) {
		super(obj);
	}
}
