import { CadObject } from '../../CadObject.js';
import { XRecord } from '../../Objects/XRecrod.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplate } from './CadTemplate.js';

export class CadXRecordTemplate extends CadTemplate<XRecord> {
	private readonly _entries: [number, number][] = [];

	constructor(cadObject?: XRecord) {
		super(cadObject ?? new XRecord());
	}

	AddHandleReference(code: number, handle: number): void {
		this._entries.push([code, handle]);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);
		const xrecord = this.CadObject as XRecord;

		for (const entry of this._entries) {
			const obj = builder.TryGetCadObject<CadObject>(entry[1]);
			if (obj) {
				xrecord.createEntry(entry[0], obj);
			} else {
				xrecord.createEntry(entry[0], entry[1]);
				builder.Notify(`XRecord reference not found ${entry[0]}|${entry[1]}`, NotificationType.Warning);
			}
		}
	}
}
