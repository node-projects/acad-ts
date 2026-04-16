import { ACadVersion } from '../ACadVersion.js';
import { CadDocument } from '../CadDocument.js';
import { CadObject } from '../CadObject.js';
import { UnknownEntity } from '../Entities/UnknownEntity.js';
import { CadDictionary } from '../Objects/CadDictionary.js';
import { UnknownNonGraphicalObject } from '../Objects/UnknownNonGraphicalObject.js';
import { AppId } from '../Tables/AppId.js';
import { BlockRecord } from '../Tables/BlockRecord.js';
import { DimensionStyle } from '../Tables/DimensionStyle.js';
import { Layer } from '../Tables/Layer.js';
import { LineType } from '../Tables/LineType.js';
import { TableEntry } from '../Tables/TableEntry.js';
import { TextStyle } from '../Tables/TextStyle.js';
import { UCS } from '../Tables/UCS.js';
import { View } from '../Tables/View.js';
import { VPort } from '../Tables/VPort.js';
import { Table } from '../Tables/Collections/Table.js';
import { AppIdsTable } from '../Tables/Collections/AppIdsTable.js';
import { BlockRecordsTable } from '../Tables/Collections/BlockRecordsTable.js';
import { DimensionStylesTable } from '../Tables/Collections/DimensionStylesTable.js';
import { LayersTable } from '../Tables/Collections/LayersTable.js';
import { LineTypesTable } from '../Tables/Collections/LineTypesTable.js';
import { TextStylesTable } from '../Tables/Collections/TextStylesTable.js';
import { UCSTable } from '../Tables/Collections/UCSTable.js';
import { ViewsTable } from '../Tables/Collections/ViewsTable.js';
import { VPortsTable } from '../Tables/Collections/VPortsTable.js';
import { NotificationEventHandler, NotificationEventArgs, NotificationType } from './NotificationEventHandler.js';
import { ICadObjectTemplate } from './Templates/ICadObjectTemplate.js';
import { ICadDictionaryTemplate } from './Templates/ICadDictionaryTemplate.js';
import { ICadTableEntryTemplate } from './Templates/ICadTableEntryTemplate.js';
import { ICadTableTemplate } from './Templates/ICadTableTemplate.js';
import { CadTemplate } from './Templates/CadTemplate.js';

export abstract class CadDocumentBuilder {
	onNotification: NotificationEventHandler | null = null;

	appIds: AppIdsTable = new AppIdsTable();
	blockRecords: BlockRecordsTable = new BlockRecordsTable();
	dimensionStyles: DimensionStylesTable = new DimensionStylesTable();
	documentToBuild: CadDocument;
	initialHandSeed: number = 0;

	abstract get keepUnknownEntities(): boolean;
	abstract get keepUnknownNonGraphicalObjects(): boolean;

	layers: LayersTable = new LayersTable();
	lineTypesTable: LineTypesTable = new LineTypesTable();
	textStyles: TextStylesTable = new TextStylesTable();
	ucSs: UCSTable = new UCSTable();
	version: ACadVersion;
	views: ViewsTable = new ViewsTable();
	vPorts: VPortsTable = new VPortsTable();

	protected cadObjects: Map<number, CadObject> = new Map();
	protected cadObjectsTemplates: Map<number, ICadObjectTemplate> = new Map();
	protected dictionaryTemplates: Map<number, ICadDictionaryTemplate> = new Map();
	protected tableEntryTemplates: Map<number, ICadTableEntryTemplate> = new Map();
	protected tableTemplates: Map<number, ICadTableTemplate> = new Map();
	protected templatesMap: Map<number, ICadObjectTemplate> = new Map();
	protected unassignedObjects: ICadObjectTemplate[] = [];

	constructor(version: ACadVersion, document: CadDocument) {
		this.version = version;
		this.documentToBuild = document;
	}

	addTemplate(template: ICadObjectTemplate): void {
		if (!this._addToMap(template)) {
			return;
		}

		const handle = template.cadObject.handle;

		if (this._isDictionaryTemplate(template)) {
			this.dictionaryTemplates.set(handle, template);
		} else if (this._isTableTemplate(template)) {
			this.tableTemplates.set(handle, template);
		} else if (this._isTableEntryTemplate(template)) {
			this.tableEntryTemplates.set(handle, template);
		} else {
			this.cadObjectsTemplates.set(handle, template);
		}
	}

	buildDocument(): void {
		for (const template of this.tableEntryTemplates.values()) {
			template.build(this);
		}

		for (const template of this.cadObjectsTemplates.values()) {
			(template as CadTemplate).build(this);
		}
	}

	buildTable<T extends TableEntry>(table: Table<T>): void {
		const template = this.tableTemplates.get(table.handle);
		if (template) {
			template.build(this);
		} else {
			this.notify(`Table ${table.objectName} not found in the document`, NotificationType.Warning);
		}
	}

	buildTables(): void {
		this.buildTable(this.appIds);
		this.buildTable(this.textStyles);
		this.buildTable(this.lineTypesTable);
		this.buildTable(this.layers);
		this.buildTable(this.ucSs);
		this.buildTable(this.views);
		this.buildTable(this.blockRecords);
		this.buildTable(this.dimensionStyles);
		this.buildTable(this.vPorts);
	}

	getObjectTemplate<T extends CadTemplate>(handle: number): T | null {
		const template = this.templatesMap.get(handle);
		if (template) {
			return template as unknown as T;
		}
		return null;
	}

	notify(message: string, notificationType: NotificationType = NotificationType.None, exception: Error | null = null): void {
		this.onNotification?.(this, new NotificationEventArgs(message, notificationType, exception));
	}

	registerTables(): void {
		this.documentToBuild.registerCollection(this.appIds);
		this.documentToBuild.registerCollection(this.textStyles);
		this.documentToBuild.registerCollection(this.lineTypesTable);
		this.documentToBuild.registerCollection(this.layers);
		this.documentToBuild.registerCollection(this.ucSs);
		this.documentToBuild.registerCollection(this.views);
		this.documentToBuild.registerCollection(this.blockRecords);
		this.documentToBuild.registerCollection(this.dimensionStyles);
		this.documentToBuild.registerCollection(this.vPorts);
	}

	tryGetCadObject<T extends CadObject>(handle: number | null | undefined): T | null {
		if (handle == null || handle === 0) {
			return null;
		}

		const obj = this.cadObjects.get(handle);
		if (obj) {
			if (obj instanceof UnknownEntity && !this.keepUnknownEntities) {
				return null;
			}

			if (obj instanceof UnknownNonGraphicalObject && !this.keepUnknownNonGraphicalObjects) {
				return null;
			}

			return obj as unknown as T;
		}

		return null;
	}

	tryGetObjectTemplate<T extends ICadObjectTemplate>(handle: number | null | undefined): T | null {
		if (handle == null || handle === 0) {
			return null;
		}

		const template = this.templatesMap.get(handle);
		if (template) {
			return template as unknown as T;
		}

		return null;
	}

	tryGetTableEntry<T extends TableEntry>(name: string): T | null {
		if (!name || name.length === 0) {
			return null;
		}

		type TableLookup = { tryGetValue(name: string): TableEntry | null };
		const tables: TableLookup[] = [
			this.appIds,
			this.layers,
			this.lineTypesTable,
			this.ucSs,
			this.views,
			this.dimensionStyles,
			this.textStyles,
			this.vPorts,
			this.blockRecords,
		];

		for (const t of tables) {
			const entry = t.tryGetValue(name);
			if (entry) {
				return entry as unknown as T;
			}
		}

		return null;
	}

	protected buildDictionaries(): void {
		for (const dictionaryTemplate of this.dictionaryTemplates.values()) {
			dictionaryTemplate.build(this);
		}

		if (!this.documentToBuild.rootDictionary) {
			const roots: CadDictionary[] = [];
			for (const t of this.dictionaryTemplates.values()) {
				if (t.cadObject instanceof CadDictionary && t.cadObject.owner == null) {
					roots.push(t.cadObject);
				}
			}

			if (roots.length !== 1) {
				this.notify(`The root dictionary could not be found.`, NotificationType.Warning);
			} else {
				this.documentToBuild.rootDictionary = roots[0];
			}
		}

		this.documentToBuild.updateCollections(true, false);
	}

	protected createMissingHandles(): void {
		let nextHandle = Number.isFinite(this.initialHandSeed) ? this.initialHandSeed : 0;
		let pending = this.unassignedObjects;
		this.unassignedObjects = [];

		while (pending.length > 0) {
			for (const template of pending) {
				nextHandle += 1;
				template.cadObject.handle = nextHandle;
				this.addTemplate(template);
			}

			pending = this.unassignedObjects;
			this.unassignedObjects = [];
		}

		this.initialHandSeed = nextHandle;
	}

	protected registerTable<T extends TableEntry>(table: Table<T> | null, tableConstructor: new () => Table<T>): void {
		if (!table) {
			this.documentToBuild.registerCollection(new tableConstructor());
		} else {
			this.documentToBuild.registerCollection(table);
		}
	}

	private _addToMap(template: ICadObjectTemplate): boolean {
		if (template.cadObject.handle === 0) {
			this._pushUnassigned(template);
			return false;
		}

		if (this.templatesMap.has(template.cadObject.handle)) {
			this.notify(`Repeated handle found ${template.cadObject.handle}.`, NotificationType.Warning);
			template.cadObject.handle = 0;
			this._pushUnassigned(template);
			return false;
		}

		if (template.cadObject.handle > this.initialHandSeed) {
			this.initialHandSeed = template.cadObject.handle;
		}

		this.templatesMap.set(template.cadObject.handle, template);
		this.cadObjects.set(template.cadObject.handle, template.cadObject);
		return true;
	}

	private _pushUnassigned(template: ICadObjectTemplate): void {
		if (!Array.isArray(this.unassignedObjects)) {
			this.unassignedObjects = [];
		}

		try {
			this.unassignedObjects.push(template);
		} catch (e) {
			if (e instanceof RangeError) {
				this.notify('Resetting unassigned object queue due to invalid array length.', NotificationType.Warning, e);
				this.unassignedObjects = [template];
				return;
			}
			throw e;
		}
	}

	private _isDictionaryTemplate(template: ICadObjectTemplate): template is ICadDictionaryTemplate {
		return template.cadObject instanceof CadDictionary;
	}

	private _isTableTemplate(template: ICadObjectTemplate): template is ICadTableTemplate {
		return 'entryHandles' in template;
	}

	private _isTableEntryTemplate(template: ICadObjectTemplate): template is ICadTableEntryTemplate {
		return 'type' in template && 'name' in template && !('entryHandles' in template);
	}
}
