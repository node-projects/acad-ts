import { ModelerGeometry } from './ModelerGeometry.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { DxfClass } from '../Classes/DxfClass.js';
import { ACadVersion } from '../ACadVersion.js';
import { ProxyFlags } from '../Classes/ProxyFlags.js';
import { ObjectType } from '../Types/ObjectType.js';
import { Matrix4 } from '../Math/Matrix4.js';
import { XYZ } from '../Math/XYZ.js';

export class Surface extends ModelerGeometry {
	override clone(): Surface {
		const copy = super.clone() as Surface;
		for (const [key, value] of Object.entries(this)) {
			if (value instanceof Matrix4) Reflect.set(copy, key, new Matrix4(Array.from({ length: 16 }, (_, i) => value.get(Math.floor(i / 4), i % 4))));
			else if (value instanceof XYZ) Reflect.set(copy, key, new XYZ(value.x, value.y, value.z));
			else if (value instanceof Uint8Array) Reflect.set(copy, key, value.slice());
		}
		return copy;
	}
	override getDxfClass(): DxfClass {
		const definition = new DxfClass();
		definition.cppClassName = this.subclassMarker;
		definition.dxfName = this.objectName;
		definition.dwgVersion = 26 as ACadVersion;
		definition.itemClassId = 498;
		definition.proxyFlags = 4095 as ProxyFlags;
		return definition;
	}
	override get objectName(): string { return DxfFileToken.entitySurface; }
	override get subclassMarker(): string { return DxfSubclassMarker.surface; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	uIsolines: number = 0;
	vIsolines: number = 0;
}
