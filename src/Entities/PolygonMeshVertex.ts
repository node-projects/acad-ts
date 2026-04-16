import { Vertex } from './Vertex.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';

export class PolygonMeshVertex extends Vertex {
	override get objectType(): ObjectType {
		return ObjectType.VERTEX_MESH;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.polygonMeshVertex;
	}

	constructor(location?: XYZ) {
		super(location ? new XYZ(location.x, location.y, location.z) : undefined);
	}
}
