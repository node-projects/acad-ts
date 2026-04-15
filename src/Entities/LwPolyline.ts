import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { LwPolylineFlags } from './LwPolylineFlags.js';
import { VertexFlags } from './VertexFlags.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';
import { PolylineExtensions } from '../Extensions/PolylineExtensions.js';

export class LwPolylineVertex {
	location: XY = new XY(0, 0);
	startWidth: number = 0;
	endWidth: number = 0;
	bulge: number = 0;
	flags: VertexFlags = 0;
	curveTangent: number = 0;
	id: number = 0;

	constructor(xy?: XY) {
		if (xy) {
			this.location = new XY(xy.x, xy.y);
		}
	}

	getLocation3D(): XYZ {
		return new XYZ(this.location.x, this.location.y, 0);
	}
}

export class LwPolyline extends Entity {
	constantWidth: number = 0;

	elevation: number = 0;

	get flags(): LwPolylineFlags { return this._flags; }
	set flags(value: LwPolylineFlags) { this._flags = value; }

	get isClosed(): boolean {
		return (this._flags & LwPolylineFlags.Closed) !== 0;
	}
	set isClosed(value: boolean) {
		if (value) {
			this._flags = this._flags | LwPolylineFlags.Closed;
		} else {
			this._flags = this._flags & ~LwPolylineFlags.Closed;
		}
	}

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.EntityLwPolyline;
	}

	override get objectType(): ObjectType {
		return ObjectType.LWPOLYLINE;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.LwPolyline;
	}

	thickness: number = 0;

	vertices: LwPolylineVertex[] = [];

	private _flags: LwPolylineFlags = LwPolylineFlags.Default;

	constructor(vertices?: LwPolylineVertex[] | XY[]) {
		super();
		if (vertices && vertices.length > 0) {
			if ('location' in vertices[0]) {
				this.vertices = vertices as LwPolylineVertex[];
			} else {
				this.vertices = (vertices as XY[]).map(xy => new LwPolylineVertex(xy));
			}
		}
	}

	override applyTransform(transform: unknown): void {
		for (const vertex of this.vertices) {
			const point = this.applyTransformToPoint(transform, new XYZ(vertex.location.x, vertex.location.y, this.elevation));
			vertex.location = new XY(point.x, point.y);
		}
		if (this.vertices.length > 0) {
			const elevationPoint = this.applyTransformToPoint(transform, new XYZ(0, 0, this.elevation));
			this.elevation = elevationPoint.z;
		}
		this.normal = this.applyTransformToVector(transform, this.normal).normalize();
	}

	public getPoints(precision: number = 256): XYZ[] {
		return PolylineExtensions.getPoints(this, precision);
	}

	override clone(): CadObject {
		const clone = super.clone() as LwPolyline;
		clone.vertices = this.vertices.map(v => {
			const nv = new LwPolylineVertex();
			nv.location = new XY(v.location.x, v.location.y);
			nv.startWidth = v.startWidth;
			nv.endWidth = v.endWidth;
			nv.bulge = v.bulge;
			nv.flags = v.flags;
			nv.curveTangent = v.curveTangent;
			nv.id = v.id;
			return nv;
		});
		return clone;
	}

	override getBoundingBox(): BoundingBox | null {
		const points = this.getPoints();
		return points.length > 0 ? BoundingBox.FromPoints(points) : null;
	}
}

export { LwPolylineFlags } from './LwPolylineFlags.js';
