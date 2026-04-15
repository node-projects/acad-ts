import { IHandledCadObject } from './IHandledCadObject.js';
import { ACadVersion } from './ACadVersion.js';
import { CadObject } from './CadObject.js';
import { CadSummaryInfo } from './CadSummaryInfo.js';
import { CollectionChangedEventArgs } from './CollectionChangedEventArgs.js';
import { CadHeader } from './Header/CadHeader.js';
import { CadDictionary } from './Objects/CadDictionary.js';
import { ColorCollection } from './Objects/Collections/ColorCollection.js';
import { GroupCollection } from './Objects/Collections/GroupCollection.js';
import { LayoutCollection } from './Objects/Collections/LayoutCollection.js';
import { MaterialCollection } from './Objects/Collections/MaterialCollection.js';
import { MLineStyleCollection } from './Objects/Collections/MLineStyleCollection.js';
import { RasterImage } from './Entities/RasterImage.js';
import { ImageDefinitionReactor } from './Objects/ImageDefinitionReactor.js';
import { AppIdsTable } from './Tables/Collections/AppIdsTable.js';
import { BlockRecordsTable } from './Tables/Collections/BlockRecordsTable.js';
import { DimensionStylesTable } from './Tables/Collections/DimensionStylesTable.js';
import { LayersTable } from './Tables/Collections/LayersTable.js';
import { LineTypesTable } from './Tables/Collections/LineTypesTable.js';
import { TextStylesTable } from './Tables/Collections/TextStylesTable.js';
import { UCSTable } from './Tables/Collections/UCSTable.js';
import { ViewsTable } from './Tables/Collections/ViewsTable.js';
import { VPortsTable } from './Tables/Collections/VPortsTable.js';

import { DxfClassCollection } from './Classes/DxfClassCollection.js';

export class CadDocument implements IHandledCadObject {
	public appIds: any | null = null; // AppIdsTable
	public blockRecords: any | null = null; // BlockRecordsTable
	public classes: any = null; // DxfClassCollection
	public colors: any | null = null; // ColorCollection
	public dictionaryVariables: any | null = null; // DictionaryVariableCollection
	public dimensionStyles: any | null = null; // DimensionStylesTable
	public get entities(): any { return this.modelSpace?.entities; }
	public groups: any | null = null; // GroupCollection
	public get handle(): number { return 0; }
	public header: any | null = null; // CadHeader
	public imageDefinitions: any | null = null; // ImageDefinitionCollection
	public layers: any | null = null; // LayersTable
	public layouts: any | null = null; // LayoutCollection
	public lineTypes: any | null = null; // LineTypesTable
	public materials: any | null = null; // MaterialCollection
	public mLeaderStyles: any | null = null; // MLeaderStyleCollection
	public mLineStyles: any | null = null; // MLineStyleCollection
	public get modelSpace(): any { return this.blockRecords?.tryGetValue("*Model_Space"); }
	public get paperSpace(): any { return this.blockRecords?.tryGetValue("*Paper_Space"); }
	public pdfDefinitions: any | null = null; // PdfDefinitionCollection
	public get rootDictionary(): any | null { return this._rootDictionary; }
	public set rootDictionary(value: any) {
		this._rootDictionary = value;
		this._rootDictionary.owner = this;
		this.registerCollection(this._rootDictionary);
	}
	public scales: any | null = null; // ScaleCollection
	public summaryInfo: CadSummaryInfo | null = null;
	public tableStyles: any | null = null; // TableStyleCollection
	public textStyles: any | null = null; // TextStylesTable
	public uCSs: any | null = null; // UCSTable
	public views: any | null = null; // ViewsTable
	public vPorts: any | null = null; // VPortsTable

	/** @internal */
	vEntityControl: any | null = null;

	private readonly _cadObjects: Map<number, IHandledCadObject> = new Map();
	private _rootDictionary: any | null = null;

	constructor();
	constructor(version: ACadVersion, createDefaults?: boolean);
	constructor(version?: ACadVersion, createDefaults: boolean = true) {
		this._cadObjects.set(this.handle, this);
		if (createDefaults) {
			this.createDefaults();
		}
		if (version !== undefined && this.header != null) {
			(this.header as any).version = version;
		}
	}

	public createDefaults(): void {
		if (this.header == null) {
			this.header = new CadHeader(this);
		}

		this.summaryInfo = new CadSummaryInfo();
		if (this.classes == null) {
			this.classes = new DxfClassCollection();
		}

		DxfClassCollection.updateDxfClasses(this);

		if (this.rootDictionary == null) {
			this.rootDictionary = CadDictionary.createRoot();
		}

		if (this.appIds == null) this.registerCollection(new AppIdsTable());
		if (this.blockRecords == null) this.registerCollection(new BlockRecordsTable());
		if (this.dimensionStyles == null) this.registerCollection(new DimensionStylesTable());
		if (this.layers == null) this.registerCollection(new LayersTable());
		if (this.lineTypes == null) this.registerCollection(new LineTypesTable());
		if (this.textStyles == null) this.registerCollection(new TextStylesTable());
		if (this.uCSs == null) this.registerCollection(new UCSTable());
		if (this.views == null) this.registerCollection(new ViewsTable());
		if (this.vPorts == null) this.registerCollection(new VPortsTable());

		// Create default line types (ByLayer, ByBlock, Continuous)
		if (this.lineTypes && typeof this.lineTypes.createDefaultEntries === 'function') {
			this.lineTypes.createDefaultEntries();
		}
		// Create default layer ("0")
		if (this.layers && typeof this.layers.createDefaultEntries === 'function') {
			this.layers.createDefaultEntries();
		}
		// Create default block records (ModelSpace, PaperSpace)
		if (this.blockRecords && typeof this.blockRecords.createDefaultEntries === 'function') {
			this.blockRecords.createDefaultEntries();
		}
		// Create default text styles ("Standard")
		if (this.textStyles && typeof this.textStyles.createDefaultEntries === 'function') {
			this.textStyles.createDefaultEntries();
		}
		// Create default dimension style ("Standard")
		if (this.dimensionStyles && typeof this.dimensionStyles.createDefaultEntries === 'function') {
			this.dimensionStyles.createDefaultEntries();
		}
		// Create default app id ("ACAD")
		if (this.appIds && typeof this.appIds.createDefaultEntries === 'function') {
			this.appIds.createDefaultEntries();
		}
		// Create default viewport ("*Active")
		if (this.vPorts && typeof this.vPorts.createDefaultEntries === 'function') {
			this.vPorts.createDefaultEntries();
		}
	}

	public getCadObject(handle: number): CadObject | null {
		const obj = this._cadObjects.get(handle);
		return (obj as CadObject) ?? null;
	}

	public tryGetCadObject(handle: number): { found: boolean; cadObject: CadObject | null } {
		if (handle === this.handle) return { found: false, cadObject: null };
		const obj = this._cadObjects.get(handle);
		if (obj) {
			return { found: true, cadObject: obj as CadObject };
		}
		return { found: false, cadObject: null };
	}

	public restoreHandles(): void {
		const source = [...this._cadObjects.values()];
		this._cadObjects.clear();
		this.header.handleSeed = 0;
		let nextHandle = 1;
		this._cadObjects.set(0, this);

		for (let i = 1; i < source.length; i++) {
			const item = source[i] as CadObject;
			item.handle = nextHandle;
			nextHandle++;
			this._cadObjects.set(item.handle, item);
		}

		this.header.handleSeed = nextHandle;
	}

	public toString(): string {
		return `${this.header?.toString() ?? 'CadDocument'}`;
	}

	public updateCollections(createDictionaries: boolean, createDefaults: boolean): void {
		if (createDictionaries && this.rootDictionary == null) {
			this.rootDictionary = CadDictionary.createRoot();
		} else if (this.rootDictionary == null) {
			return;
		}

		const groups = this.updateCollectionDict(CadDictionary.AcadGroup, createDictionaries);
		this.groups = groups.success && groups.dictionary
			? new GroupCollection(groups.dictionary)
			: null;

		const layouts = this.updateCollectionDict(CadDictionary.AcadLayout, createDictionaries);
		this.layouts = layouts.success && layouts.dictionary
			? new LayoutCollection(layouts.dictionary)
			: null;

		const colors = this.updateCollectionDict(CadDictionary.AcadColor, createDictionaries);
		this.colors = colors.success && colors.dictionary
			? new ColorCollection(colors.dictionary)
			: null;

		const materials = this.updateCollectionDict(CadDictionary.AcadMaterial, createDictionaries);
		if (materials.success && materials.dictionary) {
			this.materials = new MaterialCollection(materials.dictionary);
			if (createDefaults) {
				this.materials.createDefaults();
			}
		} else {
			this.materials = null;
		}

		const { success, dictionary } = this.updateCollectionDict(CadDictionary.AcadMLineStyle, createDictionaries);
		if (success && dictionary) {
			this.mLineStyles = new MLineStyleCollection(dictionary);
			if (createDefaults) {
				this.mLineStyles.createDefaults();
			}
		} else {
			this.mLineStyles = null;
		}
	}

	public updateDxfClasses(reset: boolean): void {
		if (reset && this.classes) {
			this.classes.clear();
		}
		DxfClassCollection.updateDxfClasses(this);

		for (const item of this.classes ?? []) {
			item.instanceCount = Array.from(this._cadObjects.values())
				.filter((cadObject): cadObject is CadObject => cadObject instanceof CadObject)
				.filter((cadObject) => cadObject.objectName === item.dxfName)
				.length;
		}
	}

	public updateImageReactors(): void {
		const reactors = Array.from(this._cadObjects.values())
			.filter((cadObject): cadObject is ImageDefinitionReactor => cadObject instanceof ImageDefinitionReactor);

		for (const reactor of reactors) {
			this.removeCadObject(reactor);
		}

		const rasterImages = Array.from(this._cadObjects.values())
			.filter((cadObject): cadObject is RasterImage => cadObject instanceof RasterImage);

		for (const image of rasterImages) {
			if (image.definition == null) {
				image.definitionReactor = null;
				continue;
			}

			const reactor = new ImageDefinitionReactor();
			reactor.owner = image;
			reactor.image = image;

			image.definitionReactor = reactor;
			this.addCadObject(reactor);
			image.definition.addReactor(reactor);
		}
	}

	/** @internal */
	registerCollection(collection: any): void {
		if (collection == null) {
			return;
		}

		if (collection instanceof CadObject) {
			if (collection.owner == null) {
				collection.owner = this;
			}
			if (collection.document == null) {
				this.addCadObject(collection);
			}
		}

		if ('onAdd' in collection) {
			collection.onAdd = this.onAdd.bind(this);
		}
		if ('onRemove' in collection) {
			collection.onRemove = this.onRemove.bind(this);
		}

		if (collection instanceof AppIdsTable) this.appIds = collection;
		else if (collection instanceof BlockRecordsTable) this.blockRecords = collection;
		else if (collection instanceof DimensionStylesTable) this.dimensionStyles = collection;
		else if (collection instanceof LayersTable) this.layers = collection;
		else if (collection instanceof LineTypesTable) this.lineTypes = collection;
		else if (collection instanceof TextStylesTable) this.textStyles = collection;
		else if (collection instanceof UCSTable) this.uCSs = collection;
		else if (collection instanceof ViewsTable) this.views = collection;
		else if (collection instanceof VPortsTable) this.vPorts = collection;

		if (typeof collection[Symbol.iterator] === 'function') {
			for (const item of collection as Iterable<any>) {
				this.wireCollectionItem(item);
			}
		}
	}

	/** @internal */
	unregisterCollection(collection: any): void {
		if (collection == null) {
			return;
		}

		if (
			collection instanceof AppIdsTable ||
			collection instanceof BlockRecordsTable ||
			collection instanceof DimensionStylesTable ||
			collection instanceof LayersTable ||
			collection instanceof LineTypesTable ||
			collection instanceof TextStylesTable ||
			collection instanceof UCSTable ||
			collection instanceof ViewsTable ||
			collection instanceof VPortsTable
		) {
			throw new Error(`The collection ${collection.constructor?.name ?? typeof collection} cannot be removed from a document.`);
		}

		if ('onAdd' in collection) {
			collection.onAdd = null;
		}
		if ('onRemove' in collection) {
			collection.onRemove = null;
		}

		if (collection instanceof CadObject) {
			this.removeCadObject(collection);
		}

		if ('onSeqendAdded' in collection) {
			collection.onSeqendAdded = null;
		}
		if ('onSeqendRemoved' in collection) {
			collection.onSeqendRemoved = null;
		}
		if ('seqend' in collection && collection.seqend instanceof CadObject) {
			this.removeCadObject(collection.seqend);
		}

		if (typeof collection[Symbol.iterator] !== 'function') {
			return;
		}

		for (const item of collection as Iterable<any>) {
			if (item instanceof CadDictionary) {
				this.unregisterCollection(item);
			} else if (item instanceof CadObject) {
				this.removeCadObject(item);
			}
		}
	}

	private addCadObject(cadObject: CadObject): void {
		if (cadObject.document != null) {
			throw new Error(`The item with handle ${cadObject.handle} is already assigned to a document`);
		}

		if (cadObject.handle === 0 || this._cadObjects.has(cadObject.handle)) {
			const nextHandle = this.header?.handleSeed ?? this._cadObjects.size;
			cadObject.handle = nextHandle;
			if (this.header) {
				this.header.handleSeed = nextHandle + 1;
			}
		} else if (this.header && cadObject.handle >= this.header.handleSeed) {
			this.header.handleSeed = cadObject.handle + 1;
		}

		this._cadObjects.set(cadObject.handle, cadObject);
		cadObject.assignDocument(this);
	}

	private onAdd(sender: any, e: CollectionChangedEventArgs): void {
		this.wireCollectionItem(e.item);
	}

	private onRemove(sender: any, e: CollectionChangedEventArgs): void {
		this.unregisterBlockMarkers(e.item);
		this.removeCadObject(e.item);
	}

	private registerBlockMarkers(item: any): void {
		if (!item || !('blockEntity' in item) || !('blockEnd' in item)) {
			return;
		}

		for (const marker of [item.blockEntity, item.blockEnd]) {
			if (marker instanceof CadObject && marker.document == null) {
				this.addCadObject(marker);
			}
		}
	}

	private unregisterBlockMarkers(item: any): void {
		if (!item || !('blockEntity' in item) || !('blockEnd' in item)) {
			return;
		}

		for (const marker of [item.blockEntity, item.blockEnd]) {
			if (marker instanceof CadObject && marker.document === this) {
				this.removeCadObject(marker);
			}
		}
	}

	private removeCadObject(cadObject: CadObject): void {
		const result = this.tryGetCadObject(cadObject.handle);
		if (!result.found || !this._cadObjects.delete(cadObject.handle)) {
			return;
		}
		cadObject.unassignDocument();
	}

	private updateCollectionDict(dictName: string, createDictionary: boolean): { success: boolean; dictionary: any | null } {
		let dictionary = this.rootDictionary?.getEntry?.(dictName) ?? null;
		if (!dictionary && createDictionary && this.rootDictionary) {
			dictionary = new CadDictionary(dictName);
			this.rootDictionary.add(dictionary);
		}

		return { success: dictionary != null, dictionary };
	}

	private wireCollectionItem(item: any): void {
		if (item instanceof CadDictionary) {
			this.registerCollection(item);
			return;
		}

		if (item instanceof CadObject && item.document == null) {
			this.addCadObject(item);
		}

		this.registerBlockMarkers(item);
		this.wireEntityCollection(item);
	}

	private wireEntityCollection(item: any): void {
		if (!item || !('entities' in item) || !item.entities) {
			return;
		}

		const entities = item.entities;
		if ('onAdd' in (entities as object)) {
			(entities as any).onAdd = this.onAdd.bind(this);
		}
		if ('onRemove' in (entities as object)) {
			(entities as any).onRemove = this.onRemove.bind(this);
		}

		if (typeof entities[Symbol.iterator] === 'function') {
			for (const entity of entities as Iterable<any>) {
				if (entity instanceof CadObject && entity.document == null) {
					this.addCadObject(entity);
				}
			}
		}
	}
}
