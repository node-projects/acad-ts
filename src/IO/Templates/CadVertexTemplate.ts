import { Entity } from '../../Entities/Entity.js';
import { Vertex } from '../../Entities/Vertex.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';
import { ObjectType } from '../../Types/ObjectType.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadVertexTemplate extends CadEntityTemplate {
	get Vertex(): Vertex { return this.CadObject as Vertex; }

	constructor(vertex?: Vertex) {
		super(vertex ?? new CadVertexTemplate.VertexPlaceholder());
	}

	SetVertexObject(vertex: Vertex): void {
		vertex.handle = this.CadObject.handle;
		vertex.owner = this.CadObject.owner;

		vertex.xDictionary = (this.CadObject as Entity).xDictionary;

		//polyLine.Reactors = this.CadObject.Reactors;
		//polyLine.ExtendedData = this.CadObject.ExtendedData;

		vertex.color = (this.CadObject as Entity).color;
		vertex.lineWeight = (this.CadObject as Entity).lineWeight;
		vertex.lineTypeScale = (this.CadObject as Entity).lineTypeScale;
		vertex.isInvisible = (this.CadObject as Entity).isInvisible;
		vertex.transparency = (this.CadObject as Entity).transparency;

		const placeholder = this.CadObject as Vertex;

		vertex.location = placeholder.location;
		vertex.startWidth = placeholder.startWidth;
		vertex.endWidth = placeholder.endWidth;
		vertex.bulge = placeholder.bulge;
		vertex.flags = placeholder.flags;
		vertex.curveTangent = placeholder.curveTangent;
		vertex.id = placeholder.id;

		this.CadObject = vertex;
	}
}

export namespace CadVertexTemplate {
	export class VertexPlaceholder extends Vertex {
		override get objectType(): ObjectType { return ObjectType.INVALID; }
		override get subclassMarker(): string { return DxfSubclassMarker.PolylineVertex; }
	}
}
