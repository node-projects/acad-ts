import { Surface } from './Surface.js';
import { Matrix4 } from '../Math/Matrix4.js';
import { XYZ } from '../Math/XYZ.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { DxfClass } from '../Classes/DxfClass.js';
import { ACadVersion } from '../ACadVersion.js';
import { ProxyFlags } from '../Classes/ProxyFlags.js';

export class RevolvedSurface extends Surface {
	draftAngle: number = 0;
	draftStartDistance: number = 0;
	draftEndDistance: number = 0;
	twistAngle: number = 0;
	isSolid: boolean = false;
	isCloseToAxis: boolean = false;
	axisPoint: XYZ = new XYZ();
	axisVector: XYZ = new XYZ();
	revolveTransform: Matrix4 = Matrix4.identity();
	revolveAngle: number = 0;
	startAngle: number = 0;
	classId: number | null = null;
	profileData: Uint8Array = new Uint8Array();
	override getDxfClass(): DxfClass {
		const definition = new DxfClass();
		definition.cppClassName = this.subclassMarker;
		definition.dxfName = this.objectName;
		definition.dwgVersion = 26 as ACadVersion;
		definition.itemClassId = 498;
		definition.proxyFlags = 0 as ProxyFlags;
		return definition;
	}
	override get objectName(): string { return DxfFileToken.entityRevolvedSurface; }
	override get subclassMarker(): string { return DxfSubclassMarker.revolvedSurface; }
}
