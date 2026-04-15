import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';

export class MeshEdge {
	start: number;
	end: number;
	crease: number | null = null;

	constructor(start: number, end: number) {
		this.start = start;
		this.end = end;
	}

	toString(): string {
		return `${this.start}|${this.end}|${this.crease ?? ''}`;
	}
}

export class Mesh extends Entity {
	blendCrease: number = 0;

	edges: MeshEdge[] = [];

	faces: number[][] = [];

	override get objectName(): string {
		return DxfFileToken.EntityMesh;
	}

	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.Mesh;
	}

	subdivisionLevel: number = 0;

	version: number = 0;

	vertices: XYZ[] = [];

	override applyTransform(transform: unknown): void {
		this.vertices = this.vertices.map((vertex) => this.applyTransformToPoint(transform, vertex));
	}

	override clone(): CadObject {
		const clone = super.clone() as Mesh;
		clone.vertices = this.vertices.map(v => new XYZ(v.x, v.y, v.z));
		clone.edges = this.edges.map(e => {
			const ne = new MeshEdge(e.start, e.end);
			ne.crease = e.crease;
			return ne;
		});
		clone.faces = this.faces.map(f => [...f]);
		return clone;
	}

	override getBoundingBox(): BoundingBox | null {
		return this.vertices.length > 0 ? BoundingBox.FromPoints(this.vertices) : null;
	}
}
