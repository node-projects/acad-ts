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
	OnNotification: NotificationEventHandler | null = null;

	AppIds: AppIdsTable = new AppIdsTable();
	BlockRecords: BlockRecordsTable = new BlockRecordsTable();
	DimensionStyles: DimensionStylesTable = new DimensionStylesTable();
	DocumentToBuild: CadDocument;
	InitialHandSeed: number = 0;

	abstract get KeepUnknownEntities(): boolean;
	abstract get KeepUnknownNonGraphicalObjects(): boolean;

	Layers: LayersTable = new LayersTable();
	LineTypesTable: LineTypesTable = new LineTypesTable();
	TextStyles: TextStylesTable = new TextStylesTable();
	UCSs: UCSTable = new UCSTable();
	Version: ACadVersion;
	Views: ViewsTable = new ViewsTable();
	VPorts: VPortsTable = new VPortsTable();

	protected cadObjects: Map<number, CadObject> = new Map();
	protected cadObjectsTemplates: Map<number, ICadObjectTemplate> = new Map();
	protected dictionaryTemplates: Map<number, ICadDictionaryTemplate> = new Map();
	protected tableEntryTemplates: Map<number, ICadTableEntryTemplate> = new Map();
	protected tableTemplates: Map<number, ICadTableTemplate> = new Map();
	protected templatesMap: Map<number, ICadObjectTemplate> = new Map();
	protected unassignedObjects: ICadObjectTemplate[] = [];

	constructor(version: ACadVersion, document: CadDocument) {
		this.Version = version;
		this.DocumentToBuild = document;
	}

	AddTemplate(template: ICadObjectTemplate): void {
		if (!this.addToMap(template)) {
			return;
		}

		if (this.isDictionaryTemplate(template)) {
			this.dictionaryTemplates.set((template as any).CadObject.handle, template as ICadDictionaryTemplate);
		} else if (this.isTableTemplate(template)) {
			this.tableTemplates.set((template as any).CadObject.handle, template as ICadTableTemplate);
		} else if (this.isTableEntryTemplate(template)) {
			this.tableEntryTemplates.set((template as any).CadObject.handle, template as ICadTableEntryTemplate);
		} else {
			this.cadObjectsTemplates.set((template as any).CadObject.handle, template);
		}
	}

	BuildDocument(): void {
		for (const template of this.tableEntryTemplates.values()) {
			template.Build(this);
		}

		for (const template of this.cadObjectsTemplates.values()) {
			(template as CadTemplate).Build(this);
		}
	}

	BuildTable<T extends TableEntry>(table: Table<T>): void {
		const template = this.tableTemplates.get(table.handle);
		if (template) {
			template.Build(this);
		} else {
			this.Notify(`Table ${table.objectName} not found in the document`, NotificationType.Warning);
		}
	}

	BuildTables(): void {
		this.BuildTable(this.AppIds);
		this.BuildTable(this.TextStyles);
		this.BuildTable(this.LineTypesTable);
		this.BuildTable(this.Layers);
		this.BuildTable(this.UCSs);
		this.BuildTable(this.Views);
		this.BuildTable(this.BlockRecords);
		this.BuildTable(this.DimensionStyles);
		this.BuildTable(this.VPorts);
	}

	GetObjectTemplate<T extends CadTemplate>(handle: number): T | null {
		const template = this.templatesMap.get(handle);
		if (template) {
			return template as unknown as T;
		}
		return null;
	}

	Notify(message: string, notificationType: NotificationType = NotificationType.None, exception: Error | null = null): void {
		this.OnNotification?.(this, new NotificationEventArgs(message, notificationType, exception));
	}

	RegisterTables(): void {
		this.DocumentToBuild.registerCollection(this.AppIds);
		this.DocumentToBuild.registerCollection(this.TextStyles);
		this.DocumentToBuild.registerCollection(this.LineTypesTable);
		this.DocumentToBuild.registerCollection(this.Layers);
		this.DocumentToBuild.registerCollection(this.UCSs);
		this.DocumentToBuild.registerCollection(this.Views);
		this.DocumentToBuild.registerCollection(this.BlockRecords);
		this.DocumentToBuild.registerCollection(this.DimensionStyles);
		this.DocumentToBuild.registerCollection(this.VPorts);
	}

	TryGetCadObject<T extends CadObject>(handle: number | null | undefined): T | null {
		if (handle == null || handle === 0) {
			return null;
		}

		const obj = this.cadObjects.get(handle);
		if (obj) {
			if (obj instanceof UnknownEntity && !this.KeepUnknownEntities) {
				return null;
			}

			if (obj instanceof UnknownNonGraphicalObject && !this.KeepUnknownNonGraphicalObjects) {
				return null;
			}

			return obj as unknown as T;
		}

		return null;
	}

	TryGetObjectTemplate<T extends ICadObjectTemplate>(handle: number | null | undefined): T | null {
		if (handle == null || handle === 0) {
			return null;
		}

		const template = this.templatesMap.get(handle);
		if (template) {
			return template as unknown as T;
		}

		return null;
	}

	TryGetTableEntry<T extends TableEntry>(name: string): T | null {
		if (!name || name.length === 0) {
			return null;
		}

		let table: Table<any> | null = null;

		// Determine the table based on T's type at runtime
		// We'll try each table in order
		const tables: Table<any>[] = [
			this.AppIds,
			this.Layers,
			this.LineTypesTable,
			this.UCSs,
			this.Views,
			this.DimensionStyles,
			this.TextStyles,
			this.VPorts,
			this.BlockRecords,
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
			dictionaryTemplate.Build(this);
		}

		if (!this.DocumentToBuild.rootDictionary) {
			const roots: CadDictionary[] = [];
			for (const t of this.dictionaryTemplates.values()) {
				if (t.CadObject instanceof CadDictionary && t.CadObject.owner == null) {
					roots.push(t.CadObject);
				}
			}

			if (roots.length !== 1) {
				this.Notify(`The root dictionary could not be found.`, NotificationType.Warning);
			} else {
				this.DocumentToBuild.rootDictionary = roots[0];
			}
		}

		this.DocumentToBuild.updateCollections(true, false);
	}

	protected createMissingHandles(): void {
		for (const template of this.unassignedObjects) {
			template.CadObject.handle = this.InitialHandSeed + 1;
			this.AddTemplate(template);
		}

		this.unassignedObjects = [];
	}

	protected registerTable<T extends TableEntry>(table: Table<T> | null, tableConstructor: new () => Table<T>): void {
		if (!table) {
			this.DocumentToBuild.registerCollection(new tableConstructor());
		} else {
			this.DocumentToBuild.registerCollection(table);
		}
	}

	private addToMap(template: ICadObjectTemplate): boolean {
		if (template.CadObject.handle === 0) {
			this.pushUnassigned(template);
			return false;
		}

		if (this.templatesMap.has(template.CadObject.handle)) {
			this.Notify(`Repeated handle found ${template.CadObject.handle}.`, NotificationType.Warning);
			template.CadObject.handle = 0;
			this.pushUnassigned(template);
			return false;
		}

		if (template.CadObject.handle > this.InitialHandSeed) {
			this.InitialHandSeed = template.CadObject.handle;
		}

		this.templatesMap.set(template.CadObject.handle, template);
		this.cadObjects.set(template.CadObject.handle, template.CadObject);
		return true;
	}

	private pushUnassigned(template: ICadObjectTemplate): void {
		if (!Array.isArray(this.unassignedObjects)) {
			this.unassignedObjects = [];
		}

		try {
			this.unassignedObjects.push(template);
		} catch (e) {
			if (e instanceof RangeError) {
				this.Notify('Resetting unassigned object queue due to invalid array length.', NotificationType.Warning, e);
				this.unassignedObjects = [template];
				return;
			}
			throw e;
		}
	}

	private isDictionaryTemplate(template: ICadObjectTemplate): template is ICadDictionaryTemplate {
		return 'CadObject' in template && template.CadObject instanceof CadDictionary;
	}

	private isTableTemplate(template: ICadObjectTemplate): template is ICadTableTemplate {
		return 'EntryHandles' in template;
	}

	private isTableEntryTemplate(template: ICadObjectTemplate): template is ICadTableEntryTemplate {
		return 'Type' in template && 'Name' in template && !('EntryHandles' in template);
	}
}
