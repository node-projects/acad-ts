import { Entity } from './Entity.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { VertexFlags } from './VertexFlags.js';
import { IVertex } from './IVertex.js';
import { XYZ } from '../Math/XYZ.js';

export abstract class Vertex extends Entity implements IVertex {
	bulge: number = 0.0;

	curveTangent: number = 0;

	endWidth: number = 0.0;

	get flags(): VertexFlags {
		return this._flags;
	}
	set flags(value: VertexFlags) {
		this._flags = value;
	}

	id: number = 0;

	location: XYZ = new XYZ(0, 0, 0);

	override get objectName(): string {
		return DxfFileToken.entityVertex;
	}

	startWidth: number = 0.0;

	protected _flags: VertexFlags = VertexFlags.Default;

	constructor(location?: XYZ) {
		super();
		if (location) {
			this.location = location;
		}
	}

	override applyTransform(transform: unknown): void {
		this.location = this.applyTransformToPoint(transform, this.location);
	}

	override getBoundingBox(): BoundingBox {
		return BoundingBox.fromPoints([this.location]);
	}

	override toString(): string {
		return `${this.subclassMarker}|${this.location.x},${this.location.y},${this.location.z}`;
	}
}
