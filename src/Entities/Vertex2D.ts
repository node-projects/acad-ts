import { Vertex } from './Vertex.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';

export class Vertex2D extends Vertex {
	override get objectType(): ObjectType {
		return ObjectType.VERTEX_2D;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.polylineVertex;
	}

	constructor(location?: XYZ) {
		super(location);
	}
}
