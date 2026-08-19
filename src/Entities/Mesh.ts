import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';
import { XRecord } from '../Objects/XRecrod.js';

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
	static readonly textureCoordsXRecordName = 'ADSK_XREC_SUBDVERTEXTEXCOORDS';

	blendCrease: number = 0;

	edges: MeshEdge[] = [];

	faces: number[][] = [];

	override get objectName(): string {
		return DxfFileToken.entityMesh;
	}

	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.mesh;
	}

	subdivisionLevel: number = 0;

	version: number = 2;

	vertices: XYZ[] = [];

	get textureCoordinates(): XYZ[] {
		const record = this.xDictionary?.getEntry<XRecord>(Mesh.textureCoordsXRecordName);
		if (!record) return [];

		const coordinates: XYZ[] = [];
		let u: number | null = null;
		let v: number | null = null;
		for (const entry of record.entries) {
			if (entry.code === 43) u = Number(entry.value);
			else if (entry.code === 44) v = Number(entry.value);
			else if (entry.code === 45) {
				if (u !== null && v !== null) coordinates.push(new XYZ(u, v, Number(entry.value)));
				u = null;
				v = null;
			}
		}
		return coordinates;
	}

	set textureCoordinates(value: Iterable<XYZ>) {
		const dictionary = this.createExtendedDictionary();
		let record = dictionary.getEntry<XRecord>(Mesh.textureCoordsXRecordName);
		if (!record) {
			record = new XRecord(Mesh.textureCoordsXRecordName);
			dictionary.add(record);
		}
		record.clear();
		for (const coordinate of value) this._appendTextureCoordinate(record, coordinate);
	}

	addTextureCoordinate(coordinate: XYZ): void {
		const dictionary = this.createExtendedDictionary();
		let record = dictionary.getEntry<XRecord>(Mesh.textureCoordsXRecordName);
		if (!record) {
			record = new XRecord(Mesh.textureCoordsXRecordName);
			dictionary.add(record);
		}
		this._appendTextureCoordinate(record, coordinate);
	}

	private _appendTextureCoordinate(record: XRecord, coordinate: XYZ): void {
		record.createEntry(43, coordinate.x);
		record.createEntry(44, coordinate.y);
		record.createEntry(45, coordinate.z);
	}

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
		return this.vertices.length > 0 ? BoundingBox.fromPoints(this.vertices) : null;
	}
}
