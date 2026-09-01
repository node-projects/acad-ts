import { ACadVersion } from '../ACadVersion.js';
import type { CadDocument } from '../CadDocument.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { DxfClass } from './DxfClass.js';
import { ProxyFlags } from './ProxyFlags.js';

export class DxfClassCollection implements Iterable<DxfClass> {
	public get count(): number {
		return this._entries.size;
	}

	public get isReadOnly(): boolean {
		return false;
	}

	public _entries: Map<string, DxfClass> = new Map<string, DxfClass>();

	/**
	 * Adds placeholder class records that do not yet have TypeScript model types.
	 * @deprecated Implemented objects are discovered by CadDocument.updateDxfClasses.
	 */
	public static updateDxfClasses(doc: CadDocument): void {
		const classes = doc.classes ??= new DxfClassCollection();
		classes.resetClassNumbers();
		const definitions: Partial<DxfClass>[] = [
			{
				cppClassName: DxfSubclassMarker.cellStyleMap,
				dwgVersion: ACadVersion.AC1021,
				dxfName: DxfFileToken.objectCellStyleMap,
				itemClassId: 499,
				maintenanceVersion: 25,
				proxyFlags: ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			},
			{
				cppClassName: 'ExAcXREFPanelObject',
				dwgVersion: 0 as ACadVersion,
				dxfName: 'EXACXREFPANELOBJECT',
				itemClassId: 499,
				proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.DisablesProxyWarningDialog,
			},
			{
				cppClassName: 'AcDbImpNonPersistentObjectsCollection',
				dwgVersion: 0 as ACadVersion,
				dxfName: 'NPOCOLLECTION',
				itemClassId: 499,
				proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			},
			{
				cppClassName: 'AcDbLayerIndex',
				dwgVersion: 0 as ACadVersion,
				dxfName: 'LAYER_INDEX',
				itemClassId: 499,
				proxyFlags: ProxyFlags.None,
			},
			{
				cppClassName: 'AcDbSpatialIndex',
				dwgVersion: 0 as ACadVersion,
				dxfName: 'SPATIAL_INDEX',
				itemClassId: 499,
				proxyFlags: ProxyFlags.None,
			},
			{
				cppClassName: 'AcDbIdBuffer',
				dwgVersion: ACadVersion.AC1014,
				dxfName: 'IDBUFFER',
				itemClassId: 499,
				proxyFlags: ProxyFlags.R13FormatProxy,
			},
			{
				cppClassName: 'AcDbSectionViewStyle',
				dwgVersion: 0 as ACadVersion,
				dxfName: 'ACDBSECTIONVIEWSTYLE',
				itemClassId: 499,
				proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.DisablesProxyWarningDialog,
			},
			{
				cppClassName: 'AcDbDetailViewStyle',
				dwgVersion: 0 as ACadVersion,
				dxfName: 'ACDBDETAILVIEWSTYLE',
				itemClassId: 499,
				proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.DisablesProxyWarningDialog,
			},
			{
				cppClassName: 'AcDbTextObjectContextData',
				dwgVersion: 0 as ACadVersion,
				dxfName: 'ACDB_TEXTOBJECTCONTEXTDATA_CLASS',
				itemClassId: 499,
				proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			},
			{
				cppClassName: 'AcDbTableGeometry',
				dwgVersion: 0 as ACadVersion,
				dxfName: 'TABLEGEOMETRY',
				itemClassId: 499,
				proxyFlags: ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			},
		];

		for (const definition of definitions) {
			const dxfClass = Object.assign(new DxfClass(), definition);
			dxfClass.classNumber = 500 + classes.count;
			classes.addOrUpdate(dxfClass);
		}
	}

	public add(item: DxfClass): void {
		this._entries.set(item.dxfName.toUpperCase(), item);
	}

	public tryAdd(item: DxfClass): boolean {
		const key = item.dxfName.toUpperCase();
		if (this._entries.has(key)) {
			return false;
		}
		this._entries.set(key, item);
		return true;
	}

	public increaseInstanceCount(dxfClass: DxfClass): void {
		const existing = this._entries.get(dxfClass.dxfName.toUpperCase());
		if (existing) {
			existing.instanceCount++;
		} else {
			dxfClass.instanceCount = 1;
			this.add(dxfClass);
		}
	}

	public addOrUpdate(item: DxfClass): void {
		const key = item.dxfName.toUpperCase();
		const existing = this._entries.get(key);
		if (existing) {
			existing.instanceCount = item.instanceCount;
		} else {
			this._entries.set(key, item);
		}
	}

	public clear(): void {
		this._entries.clear();
	}

	public containsByName(dxfname: string): boolean {
		return this._entries.has(dxfname.toUpperCase());
	}

	public contains(item: DxfClass): boolean {
		for (const value of this._entries.values()) {
			if (value === item) return true;
		}
		return false;
	}

	public copyTo(array: DxfClass[], arrayIndex: number): void {
		let i = arrayIndex;
		for (const value of this._entries.values()) {
			array[i++] = value;
		}
	}

	public getByClassNumber(id: number): DxfClass | null {
		for (const dxfClass of this._entries.values()) {
			if (dxfClass.classNumber === id) return dxfClass;
		}
		return null;
	}

	public getByName(dxfname: string): DxfClass | null {
		return this._entries.get(dxfname.toUpperCase()) ?? null;
	}

	public [Symbol.iterator](): Iterator<DxfClass> {
		return this._entries.values();
	}

	public remove(item: DxfClass): boolean {
		return this._entries.delete(item.dxfName.toUpperCase());
	}

	public resetClassNumbers(): void {
		let classNumber = 500;
		for (const item of this._entries.values()) {
			item.classNumber = classNumber++;
		}
	}

	public tryGetByClassNumber(id: number): { result: DxfClass | null; found: boolean } {
		const result = this.getByClassNumber(id);
		return { result, found: result != null };
	}

	public tryGetByName(dxfname: string): { result: DxfClass | null; found: boolean } {
		const result = this._entries.get(dxfname.toUpperCase()) ?? null;
		return { result, found: result != null };
	}
}
