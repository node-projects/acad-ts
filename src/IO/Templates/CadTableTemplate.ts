import { Table } from '../../Tables/Collections/Table.js';
import { TableEntry } from '../../Tables/TableEntry.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplate } from './CadTemplate.js';
import { ICadTableTemplate } from './ICadTableTemplate.js';

export class CadTableTemplate<T extends TableEntry> extends CadTemplate implements ICadTableTemplate {
	declare CadObject: Table<T>;

	EntryHandles: Set<number> = new Set();

	constructor(tableControl: Table<T>) {
		super(tableControl);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		for (const handle of this.EntryHandles) {
			const entry = builder.TryGetCadObject<T>(handle);
			if (!entry) continue;

			try {
				this.CadObject.add(entry);
			} catch (ex: any) {
				builder.Notify(`[${this.CadObject.subclassMarker}] error adding entry`, NotificationType.Error, ex);
			}
		}
	}
}
