import { Vertex } from './Vertex.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { VertexFlags } from './VertexFlags.js';

export class VertexFaceRecord extends Vertex {
	override get objectType(): ObjectType {
		return ObjectType.VERTEX_PFACE_FACE;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.PolyfaceMeshFace;
	}

	index1: number = 0;

	index2: number = 0;

	index3: number = 0;

	index4: number = 0;

	override get flags(): VertexFlags {
		return this._flags | VertexFlags.PolyfaceMeshVertex;
	}
	override set flags(value: VertexFlags) {
		this._flags = value;
	}
}
