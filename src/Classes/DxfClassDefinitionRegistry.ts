import { ACadVersion } from '../ACadVersion.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { DxfClass } from './DxfClass.js';
import { ProxyFlags } from './ProxyFlags.js';

export type DxfClassDefinition = Pick<DxfClass,
	'applicationName' |
	'cppClassName' |
	'dwgVersion' |
	'dxfName' |
	'itemClassId' |
	'maintenanceVersion' |
	'proxyFlags' |
	'wasZombie'>;

const definitions = new Map<string, DxfClassDefinition>();

function define(definition: Omit<DxfClassDefinition, 'applicationName' | 'wasZombie'> & Partial<Pick<DxfClassDefinition, 'applicationName' | 'wasZombie'>>): void {
	definitions.set(definition.dxfName.toUpperCase(), {
		applicationName: DxfClass.defaultApplicationName,
		wasZombie: false,
		...definition,
	});
}

define({
	cppClassName: DxfSubclassMarker.dictionaryWithDefault,
	dwgVersion: 22 as ACadVersion,
	dxfName: DxfFileToken.objectDictionaryWithDefault,
	itemClassId: 499,
	maintenanceVersion: 42,
	proxyFlags: ProxyFlags.R13FormatProxy,
});

define({
	cppClassName: DxfSubclassMarker.acDbPlaceHolder,
	dwgVersion: 0 as ACadVersion,
	dxfName: DxfFileToken.objectPlaceholder,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.None,
});

define({
	cppClassName: DxfSubclassMarker.layout,
	dwgVersion: 0 as ACadVersion,
	dxfName: DxfFileToken.objectLayout,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.None,
});

define({
	cppClassName: DxfSubclassMarker.dictionaryVar,
	dwgVersion: 20 as ACadVersion,
	dxfName: DxfFileToken.objectDictionaryVar,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.None,
});

define({
	cppClassName: DxfSubclassMarker.tableStyle,
	dwgVersion: ACadVersion.AC1018,
	dxfName: DxfFileToken.objectTableStyle,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: 4095 as ProxyFlags,
});

define({
	cppClassName: DxfSubclassMarker.material,
	dwgVersion: 0 as ACadVersion,
	dxfName: DxfFileToken.objectMaterial,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
});

define({
	cppClassName: DxfSubclassMarker.visualStyle,
	dwgVersion: ACadVersion.AC1021,
	dxfName: DxfFileToken.objectVisualStyle,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: 4095 as ProxyFlags,
});

define({
	cppClassName: DxfSubclassMarker.scale,
	dwgVersion: ACadVersion.AC1021,
	dxfName: DxfFileToken.objectScale,
	itemClassId: 499,
	maintenanceVersion: 1,
	proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
});

define({
	cppClassName: DxfSubclassMarker.mLeaderStyle,
	dwgVersion: ACadVersion.AC1021,
	dxfName: DxfFileToken.objectMLeaderStyle,
	itemClassId: 499,
	maintenanceVersion: 25,
	proxyFlags: 4095 as ProxyFlags,
});

define({
	cppClassName: DxfSubclassMarker.sortentsTable,
	dwgVersion: ACadVersion.AC1014,
	dxfName: DxfFileToken.objectSortEntsTable,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.None,
});

define({
	cppClassName: DxfSubclassMarker.arcDimension,
	dwgVersion: ACadVersion.AC1018,
	dxfName: DxfFileToken.entityArcDimension,
	itemClassId: 498,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.DisablesProxyWarningDialog,
});

define({
	cppClassName: DxfSubclassMarker.mesh,
	dwgVersion: 0 as ACadVersion,
	dxfName: DxfFileToken.entityMesh,
	itemClassId: 498,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.None,
});

define({
	cppClassName: DxfSubclassMarker.multiLeader,
	dwgVersion: ACadVersion.MC0_0,
	dxfName: DxfFileToken.entityMultiLeader,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.DisablesProxyWarningDialog,
});

define({
	cppClassName: DxfSubclassMarker.pdfReference,
	dwgVersion: 26 as ACadVersion,
	dxfName: DxfFileToken.entityPdfUnderlay,
	itemClassId: 498,
	maintenanceVersion: 0,
	proxyFlags: 4095 as ProxyFlags,
});

const imageEntityProxyFlags = ProxyFlags.EraseAllowed |
	ProxyFlags.TransformAllowed |
	ProxyFlags.ColorChangeAllowed |
	ProxyFlags.LayerChangeAllowed |
	ProxyFlags.LinetypeChangeAllowed |
	ProxyFlags.LinetypeScaleChangeAllowed |
	ProxyFlags.VisibilityChangeAllowed |
	ProxyFlags.R13FormatProxy;

define({
	applicationName: 'ISM',
	cppClassName: DxfSubclassMarker.rasterImage,
	dwgVersion: 20 as ACadVersion,
	dxfName: DxfFileToken.entityImage,
	itemClassId: 498,
	maintenanceVersion: 0,
	proxyFlags: imageEntityProxyFlags,
});

define({
	cppClassName: DxfSubclassMarker.tableEntity,
	dwgVersion: ACadVersion.AC1018,
	dxfName: DxfFileToken.entityTable,
	itemClassId: 498,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.DisablesProxyWarningDialog,
});

define({
	applicationName: 'WipeOut',
	cppClassName: DxfSubclassMarker.wipeout,
	dwgVersion: ACadVersion.AC1015,
	dxfName: DxfFileToken.entityWipeout,
	itemClassId: 498,
	maintenanceVersion: 0,
	proxyFlags: imageEntityProxyFlags,
});

define({
	cppClassName: DxfSubclassMarker.blkRefObjectContextData,
	dwgVersion: ACadVersion.AC1021,
	dxfName: DxfFileToken.blkRefObjectContextData,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
});

define({
	cppClassName: DxfSubclassMarker.dbColor,
	dwgVersion: ACadVersion.AC1015,
	dxfName: DxfFileToken.objectDBColor,
	itemClassId: 499,
	maintenanceVersion: 14,
	proxyFlags: ProxyFlags.None,
});

define({
	applicationName: 'AcDbDimAssoc',
	cppClassName: DxfSubclassMarker.dimensionAssociation,
	dwgVersion: 0 as ACadVersion,
	dxfName: DxfFileToken.objectDimensionAssociation,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.None,
});

define({
	cppClassName: DxfSubclassMarker.field,
	dwgVersion: ACadVersion.AC1018,
	dxfName: DxfFileToken.objectField,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
});

define({
	cppClassName: DxfSubclassMarker.fieldList,
	dwgVersion: ACadVersion.AC1018,
	dxfName: DxfFileToken.objectFieldList,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
});

define({
	cppClassName: DxfSubclassMarker.geoData,
	dwgVersion: ACadVersion.AC1021,
	dxfName: DxfFileToken.objectGeoData,
	itemClassId: 499,
	maintenanceVersion: 45,
	proxyFlags: 4095 as ProxyFlags,
});

define({
	applicationName: 'ISM',
	cppClassName: DxfSubclassMarker.rasterImageDef,
	dwgVersion: 20 as ACadVersion,
	dxfName: DxfFileToken.objectImageDefinition,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.None,
});

define({
	applicationName: 'ISM',
	cppClassName: DxfSubclassMarker.rasterImageDefReactor,
	dwgVersion: 20 as ACadVersion,
	dxfName: DxfFileToken.objectImageDefinitionReactor,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.EraseAllowed,
});

define({
	cppClassName: DxfSubclassMarker.mTextAttributeObjectContextData,
	dwgVersion: ACadVersion.AC1021,
	dxfName: DxfFileToken.mTextAttributeObjectContextData,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
});

define({
	cppClassName: DxfSubclassMarker.multiLeaderObjectContextData,
	dwgVersion: ACadVersion.MC0_0,
	dxfName: DxfFileToken.objectMLeaderContextData,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.DisablesProxyWarningDialog,
});

define({
	cppClassName: DxfSubclassMarker.pdfDefinition,
	dwgVersion: 26 as ACadVersion,
	dxfName: DxfFileToken.objectPdfDefinition,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.EraseAllowed | ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
});

define({
	cppClassName: DxfSubclassMarker.plotSettings,
	dwgVersion: ACadVersion.AC1015,
	dxfName: DxfFileToken.objectPlotSettings,
	itemClassId: 499,
	maintenanceVersion: 42,
	proxyFlags: ProxyFlags.None,
});

define({
	cppClassName: DxfSubclassMarker.spatialFilter,
	dwgVersion: 20 as ACadVersion,
	dxfName: DxfFileToken.objectSpatialFilter,
	itemClassId: 499,
	maintenanceVersion: 0,
	proxyFlags: ProxyFlags.None,
});

define({
	cppClassName: DxfSubclassMarker.tableContent,
	dwgVersion: ACadVersion.AC1018,
	dxfName: DxfFileToken.objectTableContent,
	itemClassId: 499,
	maintenanceVersion: 21,
	proxyFlags: ProxyFlags.CloningAllowed | ProxyFlags.DisablesProxyWarningDialog,
});

/** Returns a fresh class object so instance counts and class numbers remain document-local. */
export function createDxfClassDefinition(dxfName: string): DxfClass | null {
	const definition = definitions.get(dxfName.toUpperCase());
	return definition == null ? null : Object.assign(new DxfClass(), definition);
}
