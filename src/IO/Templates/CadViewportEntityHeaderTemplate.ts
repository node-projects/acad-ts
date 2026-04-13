import { ViewportEntityHeader } from '../../Tables/ViewportEntityHeader.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';

export class CadViewportEntityHeaderTemplate extends CadTableEntryTemplate<ViewportEntityHeader> {
	BlockHandle: number | null = null;

	constructor(entry: ViewportEntityHeader) {
		super(entry);
	}
}
