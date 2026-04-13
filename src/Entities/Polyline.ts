import { Entity } from './Entity.js';
import { SeqendCollection } from './SeqendCollection.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { PolylineFlags } from './PolylineFlags.js';
import { SmoothSurfaceType } from './SmoothSurfaceType.js';
import { XYZ } from '../Math/XYZ.js';

export abstract class Polyline extends Entity {
	static matchVerticesEntityProperties: boolean = false;

	elevation: number = 0;

	endWidth: number = 0;

	get flags(): PolylineFlags { return this._flags; }
	set flags(value: PolylineFlags) { this._flags = value; }

	get isClosed(): boolean {
		return (this._flags & PolylineFlags.ClosedPolylineOrClosedPolygonMeshInM) !== 0;
	}
	set isClosed(value: boolean) {
		if (value) {
			this._flags = this._flags | PolylineFlags.ClosedPolylineOrClosedPolygonMeshInM;
		} else {
			this._flags = this._flags & ~PolylineFlags.ClosedPolylineOrClosedPolygonMeshInM;
			this._flags = this._flags & ~PolylineFlags.ClosedPolygonMeshInN;
		}
	}

	override get layer(): any { return super.layer; }
	override set layer(value: any) {
		super.layer = value;
		if (Polyline.matchVerticesEntityProperties) {
			for (const v of this.vertices) {
				if (v instanceof Entity) {
					(v as Entity).layer = value;
				}
			}
		}
	}

	override get lineType(): any { return super.lineType; }
	override set lineType(value: any) {
		super.lineType = value;
		if (Polyline.matchVerticesEntityProperties) {
			for (const v of this.vertices) {
				if (v instanceof Entity) {
					(v as Entity).lineType = value;
				}
			}
		}
	}

	normal: XYZ = new XYZ(0, 0, 1);

	smoothSurface: SmoothSurfaceType = SmoothSurfaceType.NoSmooth;

	startWidth: number = 0;

	thickness: number = 0;

	vertices: SeqendCollection<Entity> = new SeqendCollection<Entity>();

	private _flags: PolylineFlags = 0;

	constructor(vertices?: Entity[]) {
		super();
		if (vertices) {
			this.vertices = new SeqendCollection<Entity>(...vertices);
		}
	}

	override applyTransform(transform: any): void {
		// TODO: Transform with world matrix
	}

	override clone(): CadObject {
		const clone = super.clone() as Polyline;
		clone.vertices = new SeqendCollection<Entity>(...this.vertices.map(v => v.clone() as Entity));
		return clone;
	}

	static *explode(vertices: any[], isClosed: boolean): IterableIterator<Entity> {
		// TODO: Explode vertices to lines/arcs
	}
}
