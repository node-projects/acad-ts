import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ACadVersion } from '../ACadVersion.js';

export class ProxyObject extends NonGraphicalObject {
	get classId(): number {
		return this.dxfClass?.classNumber ?? 0;
	}

	get drawingFormat(): number {
		return (this.version as number) | (this.maintenanceVersion << 16);
	}

	dxfClass: any = null;
	maintenanceVersion: number = 0;

	override get objectName(): string {
		return DxfFileToken.ObjectProxyObject;
	}

	originalDataFormatDxf: boolean = false;
	readonly proxyClassId: number = 499;
	binaryData: Uint8Array | null = null;
	data: Uint8Array | null = null;

	override get subclassMarker(): string {
		return DxfSubclassMarker.ProxyObject;
	}

	version: ACadVersion = ACadVersion.Unknown;
}
