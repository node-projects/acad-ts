import { TableEntry } from '../../Tables/TableEntry.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplateT } from './CadTemplate[T].js';
import { ICadTableEntryTemplate } from './ICadTableEntryTemplate.js';

export class CadTableEntryTemplate<T extends TableEntry = any> extends CadTemplateT<T> implements ICadTableEntryTemplate {
	get Type(): string { return this.CadObject.constructor.name; }

	get Name(): string { return this.CadObject.name; }

	constructor(entry: T) {
		super(entry);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);
	}
}

export { ICadTableEntryTemplate } from './ICadTableEntryTemplate.js';
