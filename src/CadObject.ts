import { IHandledCadObject } from './IHandledCadObject.js';
import { ObjectType } from './Types/ObjectType.js';
import type { CadDictionary } from './Objects/CadDictionary.js';
import { ExtendedDataDictionary } from './XData/ExtendedDataDictionary.js';

export abstract class CadObject implements IHandledCadObject {
	public document: /* CadDocument */ any | null = null;
	public extendedData!: ExtendedDataDictionary;
	public handle: number = 0;
	public get hasDynamicSubclass(): boolean { return false; }
	public get objectName(): string { return ""; }
	public abstract get objectType(): ObjectType;
	public owner: IHandledCadObject | null = null;

	public get reactors(): CadObject[] {
		return this._reactors;
	}

	public abstract get subclassMarker(): string;

	public get xDictionary(): CadDictionary | null { return this._xdictionary; }
	public set xDictionary(value: CadDictionary | null) {
		if (value == null) return;
		this._xdictionary = value;
		this._xdictionary.owner = this;
		if (this.document != null) {
			this.document.registerCollection(this._xdictionary);
		}
	}

	private _reactors: CadObject[] = [];
	private _xdictionary: CadDictionary | null = null;

	constructor() {
		this.extendedData = new ExtendedDataDictionary(this);
	}

	public addReactor(reactor: CadObject): void {
		this._reactors.push(reactor);
	}

	public cleanReactors(): void {
		const reactors = [...this._reactors];
		for (const reactor of reactors) {
			if (reactor.document !== this.document) {
				const idx = this._reactors.indexOf(reactor);
				if (idx >= 0) this._reactors.splice(idx, 1);
			}
		}
	}

	public clone(): CadObject {
		// TODO: MemberwiseClone equivalent - shallow copy
		const clone = Object.create(Object.getPrototypeOf(this));
		Object.assign(clone, this);

		clone.handle = 0;
		clone.document = null;
		clone.owner = null;
		clone._reactors = [];
		clone.extendedData = new ExtendedDataDictionary(clone);
		clone.xDictionary = this._xdictionary?.clone() ?? null;

		return clone;
	}

	public createExtendedDictionary(): CadDictionary {
		if (this._xdictionary == null) {
			const { CadDictionary: CadDictionaryImpl } = require('./Objects/CadDictionary');
			this.xDictionary = new CadDictionaryImpl();
		}
		return this._xdictionary!;
	}

	public removeReactor(reactor: CadObject): boolean {
		const idx = this._reactors.indexOf(reactor);
		if (idx >= 0) {
			this._reactors.splice(idx, 1);
			return true;
		}
		return false;
	}

	public toString(): string {
		return `${this.objectName}:${this.handle}`;
	}

	/** @internal */
	assignDocument(doc: any): void {
		this.document = doc;
		if (this.xDictionary != null) {
			doc.registerCollection(this.xDictionary);
		}
		if (this.extendedData.size > 0) {
			const entries = [...this.extendedData.entries()];
			this.extendedData.clear();
			for (const [key, value] of entries) {
				this.extendedData.add(key, value);
			}
		}
	}

	/** @internal */
	unassignDocument(): void {
		if (this.xDictionary != null) {
			this.document?.unregisterCollection(this.xDictionary);
		}
		this.handle = 0;
		this.document = null;
		if (this.extendedData.size > 0) {
			const entries = [...this.extendedData.entries()];
			this.extendedData.clear();
			for (const [key, value] of entries) {
				this.extendedData.add(key, value);
			}
		}
		this._reactors = [];
	}

	protected static updateCollection<T extends CadObject>(entry: T | null, table: any): T | null {
		if (table == null || entry == null) return entry;
		return table.tryAdd(entry);
	}

	public static updateCollectionStatic<T extends CadObject>(entry: T | null, table: any): T | null {
		return CadObject.updateCollection(entry, table);
	}

	protected updateCollection<T extends CadObject>(entry: T | null, table: any): T | null {
		return CadObject.updateCollection(entry, table);
	}
}
