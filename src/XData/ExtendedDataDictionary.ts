import { CadObject } from '../CadObject.js';
import type { AppId } from '../Tables/AppId.js';
import { ExtendedData } from './ExtendedData.js';
import { ExtendedDataRecord } from './ExtendedDataRecord.js';

export class ExtendedDataDictionary implements Iterable<[AppId, ExtendedData]> {
	public get document(): any /* CadDocument */ | null {
		return this.owner?.document ?? null;
	}

	public readonly owner: CadObject;

	private _data: Map<AppId, ExtendedData> = new Map<AppId, ExtendedData>();

	public constructor(owner: CadObject) {
		this.owner = owner;
	}

	public addByAppId(app: AppId, extendedData?: ExtendedData): void {
		if (extendedData === undefined) {
			extendedData = new ExtendedData();
		}

		const appTable = this.document?.appIds;
		let appId = appTable?.tryGetValue?.(app.name) ?? null;
		if (appId == null && appTable != null) {
			const seedApp = appTable.tryGetValue('ACAD') ?? [...appTable][0] ?? null;
			if (seedApp != null) {
				appId = seedApp.clone() as AppId;
				appId.name = app.name;
				appId = appTable.tryAdd(appId);
			}
		}

		appId ??= app;
		this._data.set(appId, extendedData);
	}

	public addByName(appName: string, extendedData?: ExtendedData): void {
		this.addByAppId({ name: appName } as AppId, extendedData);
	}

	public addWithRecords(app: AppId, records: ExtendedDataRecord[]): void {
		this._data.set(app, new ExtendedData(records));
	}

	public clear(): void {
		this._data.clear();
	}

	public containsKey(app: AppId): boolean {
		return this._data.has(app);
	}

	public containsKeyName(name: string): boolean {
		for (const key of this._data.keys()) {
			if (key.name === name) return true;
		}
		return false;
	}

	public getByName(name: string): ExtendedData {
		const byName = this.getExtendedDataByName();
		const result = byName.get(name.toUpperCase());
		if (!result) {
			throw new Error(`AppId '${name}' not found`);
		}
		return result;
	}

	public get(app: AppId): ExtendedData {
		const result = this._data.get(app);
		if (!result) {
			throw new Error(`AppId not found`);
		}
		return result;
	}

	public get size(): number { return this._data.size; }

  entries(): IterableIterator<[any, any]> { return this._data.entries(); }

  add(key: any, value: any): void { this._data.set(key, value); }

  set(key: any, value: any): void { this._data.set(key, value); }

  [Symbol.iterator](): Iterator<[AppId, ExtendedData]> {
		return this._data.entries();
	}

	public getExtendedDataByName(): Map<string, ExtendedData> {
		const result = new Map<string, ExtendedData>();
		for (const [key, value] of this._data) {
			result.set(key.name.toUpperCase(), value);
		}
		return result;
	}

	public tryAdd(appName: string, extendedData: ExtendedData): ExtendedData {
		const existing = this.tryGetByName(appName);
		if (existing.found) {
			return existing.value!;
		} else {
			this.addByName(appName, extendedData);
			return extendedData;
		}
	}

	public tryGet(app: AppId): { value: ExtendedData | null; found: boolean } {
		const result = this._data.get(app);
		if (result) {
			return { value: result, found: true };
		}
		return { value: null, found: false };
	}

	public tryGetByName(name: string): { value: ExtendedData | null; found: boolean } {
		const byName = this.getExtendedDataByName();
		const result = byName.get(name.toUpperCase());
		if (result) {
			return { value: result, found: true };
		}
		return { value: null, found: false };
	}
}
