import { View } from '../../Tables/View.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';

export class CadViewTemplate extends CadTableEntryTemplate<View> {
	VisualStyleHandle: number | null = null;

	NamedUcsHandle: number | null = null;

	UcsHandle: number | null = null;

	constructor(entry?: View) {
		super(entry ?? new View());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		//TODO: assign ucs for view
	}
}
