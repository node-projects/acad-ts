import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CadObject } from '../CadObject.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DictionaryCloningFlags } from './DictionaryCloningFlags.js';

export class CadDictionary extends NonGraphicalObject implements Iterable<NonGraphicalObject> {
	onAdd: ((sender: any, args: CollectionChangedEventArgs) => void) | null = null;
	onRemove: ((sender: any, args: CollectionChangedEventArgs) => void) | null = null;

	clonningFlags: DictionaryCloningFlags = DictionaryCloningFlags.NotApplicable;

	get entryHandles(): number[] { return [...this._entries.values()].map(c => c.handle); }
	get entryNames(): string[] { return [...this._entries.keys()]; }

	hardOwnerFlag: boolean = false;

	override get objectName(): string { return DxfFileToken.ObjectDictionary; }
	override get objectType(): ObjectType { return ObjectType.DICTIONARY; }
	override get subclassMarker(): string { return DxfSubclassMarker.Dictionary; }

	static readonly AcadColor = 'ACAD_COLOR';
	static readonly AcadFieldList = 'ACAD_FIELDLIST';
	static readonly AcadGroup = 'ACAD_GROUP';
	static readonly AcadImageDict = 'ACAD_IMAGE_DICT';
	static readonly AcadLayout = 'ACAD_LAYOUT';
	static readonly AcadMaterial = 'ACAD_MATERIAL';
	static readonly AcadMLeaderStyle = 'ACAD_MLEADERSTYLE';
	static readonly AcadMLineStyle = 'ACAD_MLINESTYLE';
	static readonly AcadPdfDefinitions = 'ACAD_PDFDEFINITIONS';
	static readonly AcadPlotSettings = 'ACAD_PLOTSETTINGS';
	static readonly AcadPlotStyleName = 'ACAD_PLOTSTYLENAME';
	static readonly AcadScaleList = 'ACAD_SCALELIST';
	static readonly AcadSortEnts = 'ACAD_SORTENTS';
	static readonly AcadTableStyle = 'ACAD_TABLESTYLE';
	static readonly AcadVisualStyle = 'ACAD_VISUALSTYLE';
	static readonly GeographicData = 'ACAD_GEOGRAPHICDATA';
	static readonly Root = 'ROOT';
	static readonly VariableDictionary = 'AcDbVariableDictionary';

	private _entries: Map<string, NonGraphicalObject> = new Map();

	constructor(name?: string) {
		super(name);
	}

	static createDefaultEntries(root: CadDictionary): void {
		root.tryAdd(new CadDictionary(CadDictionary.AcadColor));
		root.tryAdd(new CadDictionary(CadDictionary.AcadGroup));
		root.tryAdd(new CadDictionary(CadDictionary.AcadLayout));
		root.tryAdd(new CadDictionary(CadDictionary.AcadMaterial));
		root.tryAdd(new CadDictionary(CadDictionary.AcadSortEnts));
		root.tryAdd(new CadDictionary(CadDictionary.AcadMLeaderStyle));
		root.tryAdd(new CadDictionary(CadDictionary.AcadMLineStyle));
		root.tryAdd(new CadDictionary(CadDictionary.AcadTableStyle));
		root.tryAdd(new CadDictionary(CadDictionary.AcadPlotSettings));
		root.tryAdd(new CadDictionary(CadDictionary.VariableDictionary));
		root.tryAdd(new CadDictionary(CadDictionary.AcadScaleList));
		root.tryAdd(new CadDictionary(CadDictionary.AcadVisualStyle));
		root.tryAdd(new CadDictionary(CadDictionary.AcadFieldList));
		root.tryAdd(new CadDictionary(CadDictionary.AcadImageDict));
	}

	static createRoot(): CadDictionary {
		const root = new CadDictionary(CadDictionary.Root);
		CadDictionary.createDefaultEntries(root);
		return root;
	}

	addByKey(key: string, value: NonGraphicalObject): void {
		if (!key) {
			throw new Error('NonGraphicalObject must have a name');
		}
		this._entries.set(key.toLowerCase(), value);
		value.owner = this;
		this.onAdd?.call(this, this, new CollectionChangedEventArgs(value));
	}

	add(value: NonGraphicalObject): void {
		this.addByKey(value.name, value);
	}

	clear(): void {
		for (const [key] of this._entries) {
			this.remove(key);
		}
	}

	override clone(): CadObject {
		const clone = super.clone() as CadDictionary;
		clone.onAdd = null;
		clone.onRemove = null;
		clone._entries = new Map();
		for (const item of this._entries.values()) {
			clone.add(item.clone() as NonGraphicalObject);
		}
		return clone;
	}

	containsKey(key: string): boolean {
		return this._entries.has(key.toLowerCase());
	}

	getEntry<T extends NonGraphicalObject>(name: string): T | null {
		const entry = this._entries.get(name.toLowerCase());
		return (entry as T) ?? null;
	}

	remove(key: string): boolean {
		const item = this._entries.get(key.toLowerCase());
		if (item) {
			this._entries.delete(key.toLowerCase());
			item.owner = null;
			this.onRemove?.call(this, this, new CollectionChangedEventArgs(item));
			return true;
		}
		return false;
	}

	tryAdd(value: NonGraphicalObject): boolean {
		if (!this._entries.has(value.name.toLowerCase())) {
			this.add(value);
			return true;
		}
		return false;
	}

	get(key: string): CadObject | undefined {
		return this._entries.get(key.toLowerCase());
	}

	[Symbol.iterator](): Iterator<NonGraphicalObject> {
		return this._entries.values();
	}
}

export { DictionaryCloningFlags } from './DictionaryCloningFlags.js';
