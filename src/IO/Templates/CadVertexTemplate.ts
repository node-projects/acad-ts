import { Entity } from '../../Entities/Entity.js';
import { Vertex } from '../../Entities/Vertex.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { ObjectType } from '../../Types/ObjectType.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadVertexTemplate extends CadEntityTemplate {
	get vertex(): Vertex { return this.cadObject as Vertex; }

	constructor(vertex?: Vertex) {
		super(vertex ?? new CadVertexTemplate.VertexPlaceholder());
	}

	setVertexObject(vertex: Vertex): void {
		vertex.handle = this.cadObject.handle;
		vertex.owner = this.cadObject.owner;

		vertex.xDictionary = (this.cadObject as Entity).xDictionary;

		//polyLine.Reactors = this.CadObject.Reactors;
		//polyLine.ExtendedData = this.CadObject.ExtendedData;

		vertex.color = (this.cadObject as Entity).color;
		vertex.lineWeight = (this.cadObject as Entity).lineWeight;
		vertex.lineTypeScale = (this.cadObject as Entity).lineTypeScale;
		vertex.isInvisible = (this.cadObject as Entity).isInvisible;
		vertex.transparency = (this.cadObject as Entity).transparency;

		const placeholder = this.cadObject as Vertex;

		vertex.location = placeholder.location;
		vertex.startWidth = placeholder.startWidth;
		vertex.endWidth = placeholder.endWidth;
		vertex.bulge = placeholder.bulge;
		vertex.flags = placeholder.flags;
		vertex.curveTangent = placeholder.curveTangent;
		vertex.id = placeholder.id;

		this.cadObject = vertex;
	}
}

export namespace CadVertexTemplate {
	export class VertexPlaceholder extends Vertex {
		override get objectType(): ObjectType { return ObjectType.INVALID; }
		override get subclassMarker(): string { return DxfSubclassMarker.polylineVertex; }
	}
}
