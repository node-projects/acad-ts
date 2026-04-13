import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { ACadVersion } from '../ACadVersion.js';

export class ProxyEntity extends Entity {
	get classId(): number {
		return this.dxfClass?.classNumber ?? 0;
	}

	get drawingFormat(): number {
		return (this.version as number) | (this.maintenanceVersion << 16);
	}

	dxfClass: any = null;

	maintenanceVersion: number = 0;

	override get objectName(): string {
		return DxfFileToken.EntityProxyEntity;
	}

	override get objectType(): ObjectType {
		return ObjectType.ACAD_PROXY_ENTITY;
	}

	originalDataFormatDxf: boolean = false;

	proxyClassId: number = 498;

	override get subclassMarker(): string {
		return DxfSubclassMarker.ProxyEntity;
	}

	version: ACadVersion = ACadVersion.Unknown;

	override applyTransform(transform: any): void {
		// No-op
	}

	override getBoundingBox(): any {
		return null;
	}
}
