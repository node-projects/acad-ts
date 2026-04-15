import { CadObject } from '../../CadObject.js';
import { Entity } from '../../Entities/Entity.js';
import { AppId } from '../../Tables/AppId.js';
import { TableEntry } from '../../Tables/TableEntry.js';
import { ExtendedData } from '../../XData/ExtendedData.js';
import { ExtendedDataRecord } from '../../XData/ExtendedDataRecord.js';
import { CadDictionary } from '../../Objects/CadDictionary.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { ICadObjectTemplate } from './ICadObjectTemplate.js';

export abstract class CadTemplate<T extends CadObject = CadObject> implements ICadObjectTemplate {
	CadObject: CadObject;

	EDataTemplate: Map<number, ExtendedDataRecord[]> = new Map();

	EDataTemplateByAppName: Map<string, ExtendedDataRecord[]> = new Map();

	HasBeenBuilt: boolean = false;

	OwnerHandle: number | null = null;

	ReactorsHandles: Set<number> = new Set();

	XDictHandle: number | null = null;

	constructor(cadObject: CadObject) {
		this.CadObject = cadObject;
	}

	Build(builder: CadDocumentBuilder): void {
		if (this.HasBeenBuilt) {
			return;
		} else {
			this.HasBeenBuilt = true;
		}

		this.build(builder);
	}

	toString(): string {
		return `${this.CadObject?.toString()}`;
	}

	protected build(builder: CadDocumentBuilder): void {
		const cadDictionary = builder.TryGetCadObject<CadDictionary>(this.XDictHandle);
		if (cadDictionary) {
			this.CadObject.xDictionary = cadDictionary;
		}

		for (const handle of this.ReactorsHandles) {
			const reactor = builder.TryGetCadObject<CadObject>(handle);
			if (reactor) {
				this.CadObject.addReactor(reactor);
			} else {
				builder.Notify(`Reactor with handle ${handle} not found`, NotificationType.Warning);
			}
		}

		for (const [key, value] of this.EDataTemplate) {
			const app = builder.TryGetCadObject<AppId>(key);
			if (app) {
				this.CadObject.extendedData.set(app, new ExtendedData(value));
			} else {
				builder.Notify(`AppId in extended data with handle ${key} not found`, NotificationType.Warning);
			}
		}

		for (const [key, value] of this.EDataTemplateByAppName) {
			const app = builder.TryGetTableEntry<AppId>(key);
			if (app) {
				this.CadObject.extendedData.set(app, new ExtendedData(value));
			} else {
				builder.Notify(`AppId in extended data with handle ${key} not found`, NotificationType.Warning);
			}
		}
	}

	protected *getEntitiesCollection<T extends Entity = Entity>(builder: CadDocumentBuilder, firstHandle: number, endHandle: number): IterableIterator<T> {
		const getEntityTemplate = (handle: number | null | undefined): CadEntityTemplate | null => {
			const candidate = builder.TryGetObjectTemplate<ICadObjectTemplate>(handle);
			if (candidate && candidate.CadObject instanceof Entity && 'NextEntity' in candidate) {
				return candidate as unknown as CadEntityTemplate;
			}
			return null;
		};
		const visitedHandles = new Set<number>();

		let template = getEntityTemplate(firstHandle);

		if (!template) {
			builder.Notify(`Leading entity with handle ${firstHandle} not found.`, NotificationType.Warning);
			template = getEntityTemplate(endHandle);
		}

		while (template) {
			if (visitedHandles.has(template.CadObject.handle)) {
				builder.Notify(`Entity chain loop detected at handle ${template.CadObject.handle}`, NotificationType.Warning);
				break;
			}
			visitedHandles.add(template.CadObject.handle);

			yield template.CadObject as T;

			if (template.CadObject.handle === endHandle) {
				break;
			}

			if (template.NextEntity != null) {
				template = getEntityTemplate(template.NextEntity);
			} else {
				template = getEntityTemplate(template.CadObject.handle + 1);
			}
		}
	}

	protected getTableReference<T extends TableEntry = TableEntry>(builder: CadDocumentBuilder, handle: number | null, name: string): T | null {
		const byHandleCandidate = builder.TryGetCadObject<CadObject>(handle);
		const byHandle = byHandleCandidate instanceof TableEntry ? byHandleCandidate as T : null;
		if (byHandle) {
			return byHandle;
		}

		const byName = builder.TryGetTableEntry<T>(name);
		if (byName) {
			return byName;
		}

		if ((name && name.length > 0) || (handle != null && handle !== 0)) {
			builder.Notify(`Table reference with handle: ${handle} | name: ${name} not found for ${this.CadObject.constructor.name} with handle ${this.CadObject.handle}`, NotificationType.Warning);
		}

		return null;
	}
}

// Forward reference for CadEntityTemplate - will be in its own file
export interface CadEntityTemplate extends CadTemplate {
	NextEntity: number | null;
}
