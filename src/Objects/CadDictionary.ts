import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CadObject } from '../CadObject.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DictionaryCloningFlags } from './DictionaryCloningFlags.js';

export class CadDictionary extends NonGraphicalObject implements Iterable<NonGraphicalObject> {
	onAdd: ((sender: unknown, args: CollectionChangedEventArgs) => void) | null = null;
	onRemove: ((sender: unknown, args: CollectionChangedEventArgs) => void) | null = null;

	clonningFlags: DictionaryCloningFlags = DictionaryCloningFlags.NotApplicable;

	get entryHandles(): number[] { return [...this._entries.values()].map(c => c.handle); }
	get entryNames(): string[] { return [...this._entries.keys()]; }

	hardOwnerFlag: boolean = false;

	override get objectName(): string { return DxfFileToken.objectDictionary; }
	override get objectType(): ObjectType { return ObjectType.DICTIONARY; }
	override get subclassMarker(): string { return DxfSubclassMarker.dictionary; }

	static readonly acadColor = 'ACAD_COLOR';
	static readonly acadFieldList = 'ACAD_FIELDLIST';
	static readonly acadGroup = 'ACAD_GROUP';
	static readonly acadImageDict = 'ACAD_IMAGE_DICT';
	static readonly acadLayout = 'ACAD_LAYOUT';
	static readonly acadMaterial = 'ACAD_MATERIAL';
	static readonly acadMLeaderStyle = 'ACAD_MLEADERSTYLE';
	static readonly acadMLineStyle = 'ACAD_MLINESTYLE';
	static readonly acadPdfDefinitions = 'ACAD_PDFDEFINITIONS';
	static readonly acadPlotSettings = 'ACAD_PLOTSETTINGS';
	static readonly acadPlotStyleName = 'ACAD_PLOTSTYLENAME';
	static readonly acadScaleList = 'ACAD_SCALELIST';
	static readonly acadSortEnts = 'ACAD_SORTENTS';
	static readonly acadTableStyle = 'ACAD_TABLESTYLE';
	static readonly acadVisualStyle = 'ACAD_VISUALSTYLE';
	static readonly geographicData = 'ACAD_GEOGRAPHICDATA';
	static readonly root = 'ROOT';
	static readonly variableDictionary = 'AcDbVariableDictionary';

	private _entries: Map<string, NonGraphicalObject> = new Map();

	constructor(name?: string) {
		super(name);
	}

	static createDefaultEntries(root: CadDictionary): void {
		root.tryAdd(new CadDictionary(CadDictionary.acadColor));
		root.tryAdd(new CadDictionary(CadDictionary.acadGroup));
		root.tryAdd(new CadDictionary(CadDictionary.acadLayout));
		root.tryAdd(new CadDictionary(CadDictionary.acadMaterial));
		root.tryAdd(new CadDictionary(CadDictionary.acadSortEnts));
		root.tryAdd(new CadDictionary(CadDictionary.acadMLeaderStyle));
		root.tryAdd(new CadDictionary(CadDictionary.acadMLineStyle));
		root.tryAdd(new CadDictionary(CadDictionary.acadTableStyle));
		root.tryAdd(new CadDictionary(CadDictionary.acadPlotSettings));
		root.tryAdd(new CadDictionary(CadDictionary.variableDictionary));
		root.tryAdd(new CadDictionary(CadDictionary.acadScaleList));
		root.tryAdd(new CadDictionary(CadDictionary.acadVisualStyle));
		root.tryAdd(new CadDictionary(CadDictionary.acadFieldList));
		root.tryAdd(new CadDictionary(CadDictionary.acadImageDict));
	}

	static createRoot(): CadDictionary {
		const root = new CadDictionary(CadDictionary.root);
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
