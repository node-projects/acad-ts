import { Vertex } from './Vertex.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class VertexFaceMesh extends Vertex {
	override get objectType(): ObjectType {
		return ObjectType.VERTEX_PFACE;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.polyfaceMeshVertex;
	}
}
