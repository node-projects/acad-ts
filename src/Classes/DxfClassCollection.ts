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
			cppClassName: DxfSubclassMarker.dictionaryWithDefault,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 22 as ACadVersion,
			dxfName: DxfFileToken.objectDictionaryWithDefault,
			itemClassId: 499,
			maintenanceVersion: 42,
			proxyFlags: ProxyFlags.R13FormatProxy,
			wasZombie: false,
		}));

		// AcDbPlaceHolder
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.acDbPlaceHolder,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: DxfFileToken.objectPlaceholder,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbLayout
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.layout,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: DxfFileToken.objectLayout,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbDictionaryVar
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.dictionaryVar,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 20 as ACadVersion,
			dxfName: DxfFileToken.objectDictionaryVar,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbTableStyle
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.tableStyle,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1018,
			dxfName: DxfFileToken.objectTableStyle,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: 4095 as ProxyFlags,
			wasZombie: false,
		}));

		// AcDbMaterial
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.material,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: DxfFileToken.objectMaterial,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbVisualStyle
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.visualStyle,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1021,
			dxfName: DxfFileToken.objectVisualStyle,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: 4095 as ProxyFlags,
			wasZombie: false,
		}));

		// AcDbScale
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.scale,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1021,
			dxfName: DxfFileToken.objectScale,
			itemClassId: 499,
			maintenanceVersion: 1,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbMLeaderStyle
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.mLeaderStyle,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1021,
			dxfName: DxfFileToken.objectMLeaderStyle,
			itemClassId: 499,
			maintenanceVersion: 25,
			proxyFlags: 4095 as ProxyFlags,
			wasZombie: false,
		}));

		// AcDbCellStyleMap
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.cellStyleMap,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1021,
			dxfName: DxfFileToken.objectCellStyleMap,
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
			cppClassName: DxfSubclassMarker.mesh,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 0 as ACadVersion,
			dxfName: DxfFileToken.entityMesh,
			itemClassId: 498,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbSortentsTable
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.sortentsTable,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1014,
			dxfName: DxfFileToken.objectSortEntsTable,
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
			cppClassName: DxfSubclassMarker.wipeout,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1015,
			dxfName: DxfFileToken.entityWipeout,
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
			cppClassName: DxfSubclassMarker.tableEntity,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1018,
			dxfName: DxfFileToken.entityTable,
			itemClassId: 498,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbTableContent
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.tableContent,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1018,
			dxfName: DxfFileToken.objectTableContent,
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
			cppClassName: DxfSubclassMarker.rasterImage,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 20 as ACadVersion,
			dxfName: DxfFileToken.entityImage,
			itemClassId: 498,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.TransformAllowed | ProxyFlags.ColorChangeAllowed | ProxyFlags.LayerChangeAllowed | ProxyFlags.LinetypeChangeAllowed | ProxyFlags.LinetypeScaleChangeAllowed | ProxyFlags.VisibilityChangeAllowed | ProxyFlags.R13FormatProxy,
			wasZombie: false,
		}));

		// AcDbRasterImageDef
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			applicationName: 'ISM',
			cppClassName: DxfSubclassMarker.rasterImageDef,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 20 as ACadVersion,
			dxfName: DxfFileToken.objectImageDefinition,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbRasterImageDefReactor
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			applicationName: 'ISM',
			cppClassName: DxfSubclassMarker.rasterImageDefReactor,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 20 as ACadVersion,
			dxfName: DxfFileToken.objectImageDefinitionReactor,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed,
			wasZombie: false,
		}));

		// AcDbColor
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.dbColor,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1015,
			dxfName: DxfFileToken.objectDBColor,
			itemClassId: 499,
			maintenanceVersion: 14,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbGeoData
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.geoData,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1021,
			dxfName: DxfFileToken.objectGeoData,
			itemClassId: 499,
			maintenanceVersion: 45,
			proxyFlags: 4095 as ProxyFlags,
			wasZombie: false,
		}));

		// AcDbMLeader
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.multiLeader,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.MC0_0,
			dxfName: DxfFileToken.entityMultiLeader,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbPdfReference
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.pdfReference,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 26 as ACadVersion,
			dxfName: DxfFileToken.entityPdfUnderlay,
			itemClassId: 498,
			maintenanceVersion: 0,
			proxyFlags: 4095 as ProxyFlags,
			wasZombie: false,
		}));

		// AcDbPdfDefinition
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.pdfDefinition,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 26 as ACadVersion,
			dxfName: DxfFileToken.objectPdfDefinition,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbRasterVariables
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			applicationName: 'ISM',
			cppClassName: DxfSubclassMarker.rasterVariables,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 20 as ACadVersion,
			dxfName: DxfFileToken.objectRasterVariables,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbSpatialFilter
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.spatialFilter,
			classNumber: 500 + doc.classes.count,
			dwgVersion: 20 as ACadVersion,
			dxfName: DxfFileToken.objectSpatialFilter,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbMLeaderObjectContextData
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.multiLeaderObjectContextData,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.MC0_0,
			dxfName: DxfFileToken.objectMLeaderContextData,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbPlotSettings
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.plotSettings,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1015,
			dxfName: DxfFileToken.objectPlotSettings,
			itemClassId: 499,
			maintenanceVersion: 42,
			proxyFlags: ProxyFlags.None,
			wasZombie: false,
		}));

		// AcDbField
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.field,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1018,
			dxfName: DxfFileToken.objectField,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbFieldList
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.fieldList,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1018,
			dxfName: DxfFileToken.objectFieldList,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbMTextAttributeObjectContextData
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.mTextAttributeObjectContextData,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1021,
			dxfName: DxfFileToken.mTextAttributeObjectContextData,
			itemClassId: 499,
			maintenanceVersion: 0,
			proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
			wasZombie: false,
		}));

		// AcDbBlkRefObjectContextData
		doc.classes.addOrUpdate(Object.assign(new DxfClass(), {
			cppClassName: DxfSubclassMarker.blkRefObjectContextData,
			classNumber: 500 + doc.classes.count,
			dwgVersion: ACadVersion.AC1021,
			dxfName: DxfFileToken.blkRefObjectContextData,
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
