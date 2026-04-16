import { Polyline } from './Polyline.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import type { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { PolylineFlags } from './PolylineFlags.js';
import { SmoothSurfaceType } from './SmoothSurfaceType.js';

export class PolygonMesh extends Polyline {
	override get flags(): PolylineFlags {
		return super.flags | PolylineFlags.PolygonMesh;
	}
	override set flags(value: PolylineFlags) {
		super.flags = value;
	}

	mSmoothSurfaceDensity: number = 0;
	mVertexCount: number = 0;
	nSmoothSurfaceDensity: number = 0;
	nVertexCount: number = 0;

	override get objectName(): string {
		return DxfFileToken.entityPolyline;
	}

	override get objectType(): ObjectType {
		return ObjectType.POLYLINE_MESH;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.polygonMesh;
	}
	override getBoundingBox(): BoundingBox | null {
		return super.getBoundingBox();
	}
}
