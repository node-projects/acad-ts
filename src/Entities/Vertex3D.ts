import { Vertex } from './Vertex.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';

export class Vertex3D extends Vertex {
	override get objectType(): ObjectType {
		return ObjectType.VERTEX_3D;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.Polyline3dVertex;
	}

	constructor(location?: XYZ) {
		super(location);
	}
}
