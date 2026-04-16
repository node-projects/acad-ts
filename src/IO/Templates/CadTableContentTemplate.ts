import { TableContent } from '../../Objects/TableContent.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadTableContentTemplate extends CadTemplateT<TableContent> {
	sytleHandle: number = 0;

	constructor(cadObject?: TableContent) {
		super(cadObject ?? new TableContent());
	}
}
