import { Entity } from './Entity.js';
import { IPolyline, IVertex } from './IPolyline.js';
import { SeqendCollection } from './SeqendCollection.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { PolylineFlags } from './PolylineFlags.js';
import { SmoothSurfaceType } from './SmoothSurfaceType.js';
import { Layer } from '../Tables/Layer.js';
import { LineType } from '../Tables/LineType.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { XYZ } from '../Math/XYZ.js';
import { PolylineExtensions } from '../Extensions/PolylineExtensions.js';

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

	override get layer(): Layer { return super.layer; }
	override set layer(value: Layer) {
		super.layer = value;
		if (Polyline.matchVerticesEntityProperties) {
			for (const v of this.vertices) {
				if (v instanceof Entity) {
					(v as Entity).layer = value;
				}
			}
		}
	}

	override get lineType(): LineType { return super.lineType; }
	override set lineType(value: LineType) {
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

	public getPoints(precision: number = 256): XYZ[] {
		return PolylineExtensions.getPoints(this as unknown as IPolyline, precision);
	}

	override getBoundingBox(): BoundingBox | null {
		const points = this.getPoints();
		return points.length > 0 ? BoundingBox.FromPoints(points) : null;
	}

	override clone(): CadObject {
		const clone = super.clone() as Polyline;
		clone.vertices = new SeqendCollection<Entity>(...this.vertices.map(v => v.clone() as Entity));
		return clone;
	}

	static *explode(vertices: IVertex[], isClosed: boolean): IterableIterator<Entity> {
		const polyline: IPolyline = {
			elevation: 0,
			isClosed,
			normal: XYZ.AxisZ,
			thickness: 0,
			vertices,
		} as unknown as IPolyline;

		for (const entity of PolylineExtensions.explode(polyline)) {
			yield entity;
		}
	}
}
