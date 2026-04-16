import { Table } from '../../Tables/Collections/Table.js';
import { TableEntry } from '../../Tables/TableEntry.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplate } from './CadTemplate.js';
import { ICadTableTemplate } from './ICadTableTemplate.js';

export class CadTableTemplate<T extends TableEntry> extends CadTemplate implements ICadTableTemplate {
	declare cadObject: Table<T>;

	entryHandles: Set<number> = new Set();

	constructor(tableControl: Table<T>) {
		super(tableControl);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		for (const handle of this.entryHandles) {
			const entry = builder.tryGetCadObject<T>(handle);
			if (!entry) continue;

			try {
				this.cadObject.add(entry);
			} catch (ex: unknown) {
				builder.notify(`[${this.cadObject.subclassMarker}] error adding entry`, NotificationType.Error, ex instanceof Error ? ex : null);
			}
		}
	}
}
