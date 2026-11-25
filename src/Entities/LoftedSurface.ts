import { Surface } from './Surface.js';
import { Matrix4 } from '../Math/Matrix4.js';
import { LoftPlaneNormalType } from './LoftPlaneNormalType.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { DxfClass } from '../Classes/DxfClass.js';
import { ACadVersion } from '../ACadVersion.js';
import { ProxyFlags } from '../Classes/ProxyFlags.js';

export class LoftProfile {
	classId = 0;
	binaryData: Uint8Array = new Uint8Array();
	clone(): LoftProfile { const copy = new LoftProfile(); copy.classId = this.classId; copy.binaryData = this.binaryData.slice(); return copy; }
}

export class LoftedSurface extends Surface {
	loftTransform: Matrix4 = Matrix4.identity();
	crossSections: LoftProfile[] = [];
	guides: LoftProfile[] = [];
	path: LoftProfile | null = null;
	startDraftAngle: number = 0;
	endDraftAngle: number = 0;
	startDraftMagnitude: number = 0;
	endDraftMagnitude: number = 0;
	arcLengthParameterization: boolean = false;
	noTwist: boolean = false;
	alignDirection: boolean = false;
	simpleSurfaces: boolean = false;
	closedSurfaces: boolean = false;
	isSolid: boolean = false;
	ruledSurface: boolean = false;
	virtualGuide: boolean = false;
	planeNormalLofting: LoftPlaneNormalType = LoftPlaneNormalType.NoPlaneNormal;
	override clone(): LoftedSurface { const copy = super.clone() as LoftedSurface; copy.crossSections = this.crossSections.map(profile => profile.clone()); copy.guides = this.guides.map(profile => profile.clone()); copy.path = this.path?.clone() ?? null; return copy; }
	override getDxfClass(): DxfClass {
		const definition = new DxfClass();
		definition.cppClassName = this.subclassMarker;
		definition.dxfName = this.objectName;
		definition.dwgVersion = 26 as ACadVersion;
		definition.itemClassId = 498;
		definition.proxyFlags = 0 as ProxyFlags;
		return definition;
	}
	override get objectName(): string { return DxfFileToken.entityLoftedSurface; }
	override get subclassMarker(): string { return DxfSubclassMarker.loftedSurface; }
}
