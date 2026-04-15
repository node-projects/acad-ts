import { DxfClass } from './DxfClass.js';
import { ProxyFlags } from './ProxyFlags.js';
import { ACadVersion } from '../ACadVersion.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { DxfFileToken } from '../DxfFileToken.js';
import type { CadDocument } from '../CadDocument.js';

export class DxfClassCollection implements Iterable<DxfClass> {
	public get count(): number {
		return this._entries.size;
	}

	public get isReadOnly(): boolean {
		return false;
	}

	public _entries: Map<string, DxfClass> = new Map<string, DxfClass>();

	public static updateDxfClasses(doc: CadDocument): void {
		// AcDbDictionaryWithDefault
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.DictionaryWithDefault,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 22 as ACadVersion,
			dxfName: DxfFileToken.ObjectDictionaryWithDefault,
			itemClassId: 499,
			maintenanceVersion: 42,
			proxyFlags: ProxyFlags.R13FormatProxy,
			wasZombie: false,
		}));

		// AcDbPlaceHolder
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.AcDbPlaceHolder,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: DxfFileToken.ObjectPlaceholder,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbLayout
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.Layout,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: DxfFileToken.ObjectLayout,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbDictionaryVar
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.DictionaryVar,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 20 as ACadVersion,
			dxfName: DxfFileToken.ObjectDictionaryVar,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbTableStyle
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.TableStyle,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1018,
			dxfName: DxfFileToken.ObjectTableStyle,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: 4095 as ProxyFlags,
			wasZombie: false,
		}));

		// AcDbMaterial
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.Material,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: DxfFileToken.ObjectMaterial,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbVisualStyle
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.VisualStyle,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1021,
			dxfName: DxfFileToken.ObjectVisualStyle,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: 4095 as ProxyFlags,
			wasZombie: false,
		}));

		// AcDbScale
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.Scale,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1021,
			dxfName: DxfFileToken.ObjectScale,
			itemClassId: 499,
			maintenanceVersion: 1,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbMLeaderStyle
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.MLeaderStyle,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1021,
			dxfName: DxfFileToken.ObjectMLeaderStyle,
			itemClassId: 499,
			maintenanceVersion: 25,
			proxyFlags: 4095 as ProxyFlags,
			wasZombie: false,
		}));

		// AcDbCellStyleMap
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.CellStyleMap,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1021,
			dxfName: DxfFileToken.ObjectCellStyleMap,
			itemClassId: 499,
			maintenanceVersion: 25,
			proxyFlags: ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// ExAcXREFPanelObject
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: 'ExAcXREFPanelObject',
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: 'EXACXREFPANELOBJECT',
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbImpNonPersistentObjectsCollection
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: 'AcDbImpNonPersistentObjectsCollection',
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: 'NPOCOLLECTION',
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbLayerIndex
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: 'AcDbLayerIndex',
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: 'LAYER_INDEX',
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbSpatialIndex
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: 'AcDbSpatialIndex',
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: 'SPATIAL_INDEX',
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbIdBuffer
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: 'AcDbIdBuffer',
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1014,
			dxfName: 'IDBUFFER',
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.R13FormatProxy,
			wasZombie: false,
		}));

		// AcDbSectionViewStyle
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: 'AcDbSectionViewStyle',
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: 'ACDBSECTIONVIEWSTYLE',
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbDetailViewStyle
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: 'AcDbDetailViewStyle',
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: 'ACDBDETAILVIEWSTYLE',
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbSubDMesh
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.Mesh,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: DxfFileToken.EntityMesh,
			itemClassId: 498,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbSortentsTable
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.SortentsTable,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1014,
			dxfName: DxfFileToken.ObjectSortEntsTable,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbTextObjectContextData
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: 'AcDbTextObjectContextData',
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: 'ACDB_TEXTOBJECTCONTEXTDATA_CLASS',
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbWipeout
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			applicationName: 'WipeOut',
			cppClassName: DxfSubclassMarker.Wipeout,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1015,
			dxfName: DxfFileToken.EntityWipeout,
			itemClassId: 498,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.TransformAllowed | ProxyFlags.ColorChangeAllowed | ProxyFlags.LayerChangeAllowed | ProxyFlags.LinetypeChangeAllowed | ProxyFlags.LinetypeScaleChangeAllowed | ProxyFlags.VisibilityChangeAllowed | ProxyFlags.R13FormatProxy,
			wasZombie: false,
		}));

		// AcDbWipeoutVariables
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			applicationName: 'WipeOut',
			cppClassName: 'AcDbWipeoutVariables',
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1015,
			dxfName: 'WIPEOUTVARIABLES',
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.R13FormatProxy,
			wasZombie: false,
		}));

		// AcDbDimAssoc
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			applicationName: 'AcDbDimAssoc',
			cppClassName: 'AcDbDimAssoc',
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: 'DIMASSOC',
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbTable
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.TableEntity,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1018,
			dxfName: DxfFileToken.EntityTable,
			itemClassId: 498,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbTableContent
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.TableContent,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1018,
			dxfName: DxfFileToken.ObjectTableContent,
			itemClassId: 499,
			maintenanceVersion: 21,
			proxyFlags: ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbTableGeometry
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: 'AcDbTableGeometry',
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: 'TABLEGEOMETRY',
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbRasterImage
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			applicationName: 'ISM',
			cppClassName: DxfSubclassMarker.RasterImage,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 20 as ACadVersion,
			dxfName: DxfFileToken.EntityImage,
			itemClassId: 498,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.TransformAllowed | ProxyFlags.ColorChangeAllowed | ProxyFlags.LayerChangeAllowed | ProxyFlags.LinetypeChangeAllowed | ProxyFlags.LinetypeScaleChangeAllowed | ProxyFlags.VisibilityChangeAllowed | ProxyFlags.R13FormatProxy,
			wasZombie: false,
		}));

		// AcDbRasterImageDef
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			applicationName: 'ISM',
			cppClassName: DxfSubclassMarker.RasterImageDef,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 20 as ACadVersion,
			dxfName: DxfFileToken.ObjectImageDefinition,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbRasterImageDefReactor
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			applicationName: 'ISM',
			cppClassName: DxfSubclassMarker.RasterImageDefReactor,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 20 as ACadVersion,
			dxfName: DxfFileToken.ObjectImageDefinitionReactor,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed,
			wasZombie: false,
		}));

		// AcDbColor
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.DbColor,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1015,
			dxfName: DxfFileToken.ObjectDBColor,
			itemClassId: 499,
			maintenanceVersion: 14,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbGeoData
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.GeoData,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1021,
			dxfName: DxfFileToken.ObjectGeoData,
			itemClassId: 499,
			maintenanceVersion: 45,
			proxyFlags: 4095 as ProxyFlags,
			wasZombie: false,
		}));

		// AcDbMLeader
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.MultiLeader,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.MC0_0,
			dxfName: DxfFileToken.EntityMultiLeader,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbPdfReference
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.PdfReference,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 26 as ACadVersion,
			dxfName: DxfFileToken.EntityPdfUnderlay,
			itemClassId: 498,
			maintenanceVersion: 0,
			proxyFlags: 4095 as ProxyFlags,
			wasZombie: false,
		}));

		// AcDbPdfDefinition
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.PdfDefinition,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 26 as ACadVersion,
			dxfName: DxfFileToken.ObjectPdfDefinition,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbRasterVariables
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			applicationName: 'ISM',
			cppClassName: DxfSubclassMarker.RasterVariables,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 20 as ACadVersion,
			dxfName: DxfFileToken.ObjectRasterVariables,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbSpatialFilter
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.SpatialFilter,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 20 as ACadVersion,
			dxfName: DxfFileToken.ObjectSpatialFilter,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbMLeaderObjectContextData
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.MultiLeaderObjectContextData,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.MC0_0,
			dxfName: DxfFileToken.ObjectMLeaderContextData,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbPlotSettings
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.PlotSettings,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1015,
			dxfName: DxfFileToken.ObjectPlotSettings,
			itemClassId: 499,
			maintenanceVersion: 42,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbField
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.Field,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1018,
			dxfName: DxfFileToken.ObjectField,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbFieldList
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.FieldList,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1018,
			dxfName: DxfFileToken.ObjectFieldList,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbMTextAttributeObjectContextData
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.MTextAttributeObjectContextData,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1021,
			dxfName: DxfFileToken.MTextAttributeObjectContextData,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbBlkRefObjectContextData
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.BlkRefObjectContextData,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1021,
			dxfName: DxfFileToken.BlkRefObjectContextData,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));
	}

	public add(item: DxfClass): void {
		this._entries.set(item.dxfName.toUpperCase(), item);
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
		for (const c of this._entries.values()) {
			if (c.classNumber === id) return c;
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

	public tryGetByClassNumber(id: number): { result: DxfClass | null; found: boolean } {
		for (const c of this._entries.values()) {
			if (c.classNumber === id) return { result: c, found: true };
		}
		return { result: null, found: false };
	}

	public tryGetByName(dxfname: string): { result: DxfClass | null; found: boolean } {
		const result = this._entries.get(dxfname.toUpperCase());
		if (result) {
			return { result, found: true };
		}
		return { result: null, found: false };
	}
}
