import { Polyline } from './Polyline.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { PolylineFlags } from './PolylineFlags.js';
import { Entity } from './Entity.js';
import { SeqendCollection } from './SeqendCollection.js';
import type { BoundingBox } from '../Math/BoundingBox.js';
import { Vertex3D } from './Vertex3D.js';
import { XYZ } from '../Math/XYZ.js';

export class Polyline3D extends Polyline {
	override get flags(): PolylineFlags {
		return super.flags | PolylineFlags.Polyline3D;
	}
	override set flags(value: PolylineFlags) {
		super.flags = value;
	}

	override get objectName(): string {
		return DxfFileToken.EntityPolyline;
	}

	override get objectType(): ObjectType {
		return ObjectType.POLYLINE_3D;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.Polyline3d;
	}

	constructor(vertices?: Vertex3D[] | XYZ[]) {
		super();
		if (vertices && vertices.length > 0) {
			if (vertices[0] instanceof Vertex3D) {
				this.vertices = new SeqendCollection<Entity>(...(vertices as Vertex3D[]));
			} else {
				this.vertices = new SeqendCollection<Entity>(...(vertices as XYZ[]).map(xyz => new Vertex3D(xyz)));
			}
		}
	}

	override getBoundingBox(): BoundingBox | null { return super.getBoundingBox(); }
}
