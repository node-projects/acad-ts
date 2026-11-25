import { Surface } from './Surface.js';
import { Matrix4 } from '../Math/Matrix4.js';
import { XYZ } from '../Math/XYZ.js';
import { SweepAlignment } from './SweepAlignment.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { DxfClass } from '../Classes/DxfClass.js';
import { ACadVersion } from '../ACadVersion.js';
import { ProxyFlags } from '../Classes/ProxyFlags.js';

export class ExtrudedSurface extends Surface {
	draftAngle: number = 0;
	draftStartDistance: number = 0;
	draftEndDistance: number = 0;
	twistAngle: number = 0;
	scaleFactor: number = 1;
	alignAngle: number = 0;
	isSolid: boolean = false;
	sweepAlignment: SweepAlignment = SweepAlignment.NoAlignment;
	unknown71: number = 0;
	alignStart: boolean = false;
	bank: boolean = false;
	basePointSet: boolean = false;
	referenceVector: XYZ = new XYZ();
	sweepEntityTransformComputed: boolean = false;
	pathEntityTransformComputed: boolean = false;
	sweepEntityTransform: Matrix4 = Matrix4.identity();
	pathEntityTransform: Matrix4 = Matrix4.identity();
	classId: number | null = null;
	profileData: Uint8Array = new Uint8Array();
	direction: XYZ = new XYZ();
	extrusionTransform: Matrix4 = Matrix4.identity();
	override getDxfClass(): DxfClass {
		const definition = new DxfClass();
		definition.cppClassName = this.subclassMarker;
		definition.dxfName = this.objectName;
		definition.dwgVersion = 26 as ACadVersion;
		definition.itemClassId = 498;
		definition.proxyFlags = 0 as ProxyFlags;
		return definition;
	}
	override get objectName(): string { return DxfFileToken.entityExtrudedSurface; }
	override get subclassMarker(): string { return DxfSubclassMarker.extrudedSurface; }
}
