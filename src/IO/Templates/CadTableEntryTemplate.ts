import { TableEntry } from '../../Tables/TableEntry.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplateT } from './CadTemplate[T].js';
import { ICadTableEntryTemplate } from './ICadTableEntryTemplate.js';

export class CadTableEntryTemplate<T extends TableEntry = TableEntry> extends CadTemplateT<T> implements ICadTableEntryTemplate {
	get type(): string { return this.cadObject.constructor.name; }

	get name(): string { return this.cadObject.name; }

	constructor(entry: T) {
		super(entry);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);
	}
}

export { ICadTableEntryTemplate } from './ICadTableEntryTemplate.js';
