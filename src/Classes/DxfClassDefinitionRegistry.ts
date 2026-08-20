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

/** Returns a fresh class object so instance counts and class numbers remain document-local. */
export function createDxfClassDefinition(dxfName: string): DxfClass | null {
	const definition = definitions.get(dxfName.toUpperCase());
	return definition == null ? null : Object.assign(new DxfClass(), definition);
}
