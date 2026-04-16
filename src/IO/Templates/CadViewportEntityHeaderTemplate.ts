import { BlockRecord } from '../../Tables/BlockRecord.js';
import { ViewportEntityHeader } from '../../Tables/ViewportEntityHeader.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';

export class CadViewportEntityHeaderTemplate extends CadTableEntryTemplate<ViewportEntityHeader> {
	blockHandle: number | null = null;

	constructor(entry: ViewportEntityHeader) {
		super(entry);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const blockRecord = builder.tryGetCadObject<BlockRecord>(this.blockHandle);
		if (blockRecord) {
			this.cadObject.blockRecord = blockRecord;
		} else if (this.blockHandle != null && this.blockHandle !== 0) {
			builder.notify(`ViewportEntityHeader block ${this.blockHandle} not found for ${this.cadObject.handle}`, NotificationType.Warning);
		}
	}
}
