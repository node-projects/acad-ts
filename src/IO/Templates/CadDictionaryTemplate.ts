import { CadDictionary } from '../../Objects/CadDictionary.js';
import { NonGraphicalObject } from '../../Objects/NonGraphicalObject.js';
import { CadObject } from '../../CadObject.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { DwgDocumentBuilder } from '../DWG/DwgDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTemplateT } from './CadTemplate[T].js';
import { ICadDictionaryTemplate } from './ICadDictionaryTemplate.js';

export class CadDictionaryTemplate extends CadTemplateT<CadDictionary> implements ICadDictionaryTemplate {
	Entries: Map<string, number | null> = new Map();

	constructor(dictionary?: CadDictionary) {
		super(dictionary ?? new CadDictionary());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		if (this.OwnerHandle != null
			&& this.OwnerHandle === 0
			&& builder.DocumentToBuild.rootDictionary == null) {
			if (builder instanceof DwgDocumentBuilder) {
				const dwgBuilder = builder as DwgDocumentBuilder;
				if (this.CadObject.handle === dwgBuilder.HeaderHandles.DICTIONARY_NAMED_OBJECTS) {
					builder.DocumentToBuild.rootDictionary = this.CadObject;
				} else {
					builder.DocumentToBuild.rootDictionary = this.CadObject;
				}
			} else {
				builder.DocumentToBuild.rootDictionary = this.CadObject;
			}
		}

		for (const [key, value] of this.Entries) {
			const entry = builder.TryGetCadObject<NonGraphicalObject>(value);
			if (entry) {
				if (!entry.name || entry.name.length === 0) {
					entry.name = key;
				}

				try {
					this.CadObject.add(entry);
				} catch (ex: any) {
					builder.Notify(`Error when trying to add the entry ${entry.name} to ${this.CadObject.name}|${this.CadObject.handle}`, NotificationType.Error, ex);
				}
			} else {
				builder.Notify(`Entry not found ${key}|${value} for dictionary ${this.CadObject.name}|${this.CadObject.handle}`, NotificationType.Warning);
			}
		}
	}
}
