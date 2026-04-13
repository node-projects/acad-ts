import { UCS } from '../../Tables/UCS.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';

export class CadUcsTemplate extends CadTableEntryTemplate<UCS> {
	constructor(entry?: UCS) {
		super(entry ?? new UCS());
	}
}
