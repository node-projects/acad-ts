import { DxfClass } from './Classes/DxfClass.js';
import { ACadVersion } from './ACadVersion.js';

export interface IProxy {
	classId: number;
	dxfClass: DxfClass | null;
	proxyClassId: number;
	originalDataFormatDxf: boolean;
	version: ACadVersion;
	maintenanceVersion: number;
}
