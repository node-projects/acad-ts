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

	addHandleReference(code: number, handle: number): void {
		this._entries.push([code, handle]);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);
		const xrecord = this.cadObject as XRecord;

		for (const entry of this._entries) {
			const obj = builder.tryGetCadObject<CadObject>(entry[1]);
			if (obj) {
				xrecord.createEntry(entry[0], obj);
			} else {
				xrecord.createEntry(entry[0], entry[1]);
				builder.notify(`XRecord reference not found ${entry[0]}|${entry[1]}`, NotificationType.Warning);
			}
		}
	}
}
