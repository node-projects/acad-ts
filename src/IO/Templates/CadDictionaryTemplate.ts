import { CadDictionary } from '../../Objects/CadDictionary.js';
import { NonGraphicalObject } from '../../Objects/NonGraphicalObject.js';
import { CadObject } from '../../CadObject.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { DwgDocumentBuilder } from '../DWG/DwgDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
import { ICadDictionaryTemplate } from './ICadDictionaryTemplate.js';

export class CadDictionaryTemplate extends CadTemplateT<CadDictionary> implements ICadDictionaryTemplate {
	entries: Map<string, number | null> = new Map();

	constructor(dictionary?: CadDictionary) {
		super(dictionary ?? new CadDictionary());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		if (this.ownerHandle != null
			&& this.ownerHandle === 0
			&& builder.documentToBuild.rootDictionary == null) {
			if (builder instanceof DwgDocumentBuilder) {
				const dwgBuilder = builder as DwgDocumentBuilder;
				if (this.cadObject.handle === dwgBuilder.headerHandles.dictionary_named_objects) {
					builder.documentToBuild.rootDictionary = this.cadObject;
				} else {
					builder.documentToBuild.rootDictionary = this.cadObject;
				}
			} else {
				builder.documentToBuild.rootDictionary = this.cadObject;
			}
		}

		for (const [key, value] of this.entries) {
			const entry = builder.tryGetCadObject<NonGraphicalObject>(value);
			if (entry) {
				if (!entry.name || entry.name.length === 0) {
					entry.name = key;
				}

				try {
					this.cadObject.add(entry);
				} catch (ex: unknown) {
					builder.notify(`Error when trying to add the entry ${entry.name} to ${this.cadObject.name}|${this.cadObject.handle}`, NotificationType.Error, ex instanceof Error ? ex : null);
				}
			} else {
				builder.notify(`Entry not found ${key}|${value} for dictionary ${this.cadObject.name}|${this.cadObject.handle}`, NotificationType.Warning);
			}
		}
	}
}
