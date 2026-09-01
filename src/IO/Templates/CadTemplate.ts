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
import { ReadStage } from '../ProgressEventHandler.js';
import type { DxfClass } from '../../Classes/DxfClass.js';
import { ProxyEntity } from '../../Entities/ProxyEntity.js';
import { UnknownEntity } from '../../Entities/UnknownEntity.js';
import { ProxyObject } from '../../Objects/ProxyObject.js';
import { UnknownNonGraphicalObject } from '../../Objects/UnknownNonGraphicalObject.js';
import { applyTextStyleTrueTypeFromExtendedData } from '../TextStyleExtendedData.js';
import { TextStyle } from '../../Tables/TextStyle.js';

export abstract class CadTemplate<T extends CadObject = CadObject> implements ICadObjectTemplate {
	cadObject: CadObject;

	dxfClass: DxfClass | null = null;

	eDataTemplate: Map<number, ExtendedDataRecord[]> = new Map();

	eDataTemplateByAppName: Map<string, ExtendedDataRecord[]> = new Map();

	hasBeenBuilt: boolean = false;

	ownerHandle: number | null = null;

	reactorsHandles: Set<number> = new Set();

	xDictHandle: number | null = null;

	constructor(cadObject: CadObject) {
		this.cadObject = cadObject;
	}

	build(builder: CadDocumentBuilder): void {
		if (this.hasBeenBuilt) {
			return;
		} else {
			this.hasBeenBuilt = true;
		}

		this._build(builder);

		if (
			this.dxfClass != null &&
			this.cadObject.getDxfClass() == null &&
			!(this.cadObject instanceof ProxyEntity) &&
			!(this.cadObject instanceof ProxyObject) &&
			!(this.cadObject instanceof UnknownEntity) &&
			!(this.cadObject instanceof UnknownNonGraphicalObject)
		) {
			builder.notify(`${this.cadObject.constructor.name} does not provide DXF class metadata`, NotificationType.Warning);
		}
		builder.notifyProgress(ReadStage.Build, this.cadObject);
	}

	toString(): string {
		return `${this.cadObject?.toString()}`;
	}

	protected _build(builder: CadDocumentBuilder): void {
		const cadDictionary = builder.tryGetCadObject<CadDictionary>(this.xDictHandle);
		if (cadDictionary) {
			this.cadObject.xDictionary = cadDictionary;
		}

		for (const handle of this.reactorsHandles) {
			const reactor = builder.tryGetCadObject<CadObject>(handle);
			if (reactor) {
				this.cadObject.addReactor(reactor);
			} else {
				builder.notify(`Reactor with handle ${handle} not found`, NotificationType.Warning);
			}
		}

		for (const [key, value] of this.eDataTemplate) {
			const app = builder.tryGetCadObject<AppId>(key);
			if (app) {
				this.cadObject.extendedData.set(app, new ExtendedData(value));
			} else {
				builder.notify(`AppId in extended data with handle ${key} not found`, NotificationType.Warning);
			}
		}

		for (const [key, value] of this.eDataTemplateByAppName) {
			const app = builder.tryGetTableEntry<AppId>(key);
			if (app) {
				this.cadObject.extendedData.set(app, new ExtendedData(value));
			} else {
				builder.notify(`AppId in extended data with handle ${key} not found`, NotificationType.Warning);
			}
		}

		const cadObject = this.cadObject;
		if (cadObject instanceof TextStyle) {
			applyTextStyleTrueTypeFromExtendedData(cadObject);
		}
	}

	protected *getEntitiesCollection<T extends Entity = Entity>(builder: CadDocumentBuilder, firstHandle: number, endHandle: number): IterableIterator<T> {
		const getEntityTemplate = (handle: number | null | undefined): CadEntityTemplate | null => {
			const candidate = builder.tryGetObjectTemplate<ICadObjectTemplate>(handle);
			if (candidate && candidate.cadObject instanceof Entity && 'nextEntity' in candidate) {
				return candidate as unknown as CadEntityTemplate;
			}
			return null;
		};
		const visitedHandles = new Set<number>();

		let template = getEntityTemplate(firstHandle);

		if (!template) {
			builder.notify(`Leading entity with handle ${firstHandle} not found.`, NotificationType.Warning);
			template = getEntityTemplate(endHandle);
		}

		while (template) {
			if (visitedHandles.has(template.cadObject.handle)) {
				builder.notify(`Entity chain loop detected at handle ${template.cadObject.handle}`, NotificationType.Warning);
				break;
			}
			visitedHandles.add(template.cadObject.handle);

			yield template.cadObject as T;

			if (template.cadObject.handle === endHandle) {
				break;
			}

			if (template.nextEntity != null) {
				template = getEntityTemplate(template.nextEntity);
			} else {
				template = getEntityTemplate(template.cadObject.handle + 1);
			}
		}
	}

	protected getTableReference<T extends TableEntry>(builder: CadDocumentBuilder, handle: number | null, name: string, entryType: abstract new (...args: any[]) => T): T | null {
		const byHandleCandidate = builder.tryGetCadObject<CadObject>(handle);
		const byHandle = byHandleCandidate instanceof entryType ? byHandleCandidate : null;
		if (byHandle) {
			return byHandle;
		}

		const byName = builder.tryGetTableEntry<TableEntry>(name);
		if (byName instanceof entryType) {
			return byName;
		}

		if ((name && name.length > 0) || (handle != null && handle !== 0)) {
			builder.notify(`Table reference with handle: ${handle} | name: ${name} not found for ${this.cadObject.constructor.name} with handle ${this.cadObject.handle}`, NotificationType.Warning);
		}

		return null;
	}
}

// Forward reference for CadEntityTemplate - will be in its own file
export interface CadEntityTemplate extends CadTemplate {
	nextEntity: number | null;
}
