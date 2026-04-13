import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { MLineFlags } from './MLineFlags.js';
import { MLineJustification } from './MLineJustification.js';
import { XYZ } from '../Math/XYZ.js';

export class MLineSegment {
	parameters: number[] = [];
	areaFillParameters: number[] = [];

	applyScale(scaleFactor: number): void {
		this.parameters = this.parameters.map(p => p * scaleFactor);
		this.areaFillParameters = this.areaFillParameters.map(p => p * scaleFactor);
	}

	clone(): MLineSegment {
		const c = new MLineSegment();
		c.parameters = [...this.parameters];
		c.areaFillParameters = [...this.areaFillParameters];
		return c;
	}
}

export class MLineVertex {
	position: XYZ = new XYZ(0, 0, 0);
	direction: XYZ = new XYZ(0, 0, 0);
	miter: XYZ = new XYZ(0, 0, 0);
	segments: MLineSegment[] = [];

	applyTransform(transform: any): void {
		// TODO: Transform position, direction, miter
		// Apply miter length scale to segments
	}

	clone(): MLineVertex {
		const c = new MLineVertex();
		c.position = new XYZ(this.position.x, this.position.y, this.position.z);
		c.direction = new XYZ(this.direction.x, this.direction.y, this.direction.z);
		c.miter = new XYZ(this.miter.x, this.miter.y, this.miter.z);
		c.segments = this.segments.map(s => s.clone());
		return c;
	}
}

export class MLine extends Entity {
	flags: MLineFlags = MLineFlags.Has;

	justification: MLineJustification = MLineJustification.Zero;

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.EntityMLine;
	}

	override get objectType(): ObjectType {
		return ObjectType.MLINE;
	}

	scaleFactor: number = 1;

	startPoint: XYZ = new XYZ(0, 0, 0);

	get style(): any { return this._style; }
	set style(value: any) {
		if (!value) throw new Error('MLine style cannot be null');
		this._style = value;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.MLine;
	}

	vertices: MLineVertex[] = [];

	private _style: any = null;

	override applyTransform(transform: any): void {
		// TODO: Transform normal, startPoint, vertices
	}

	override clone(): CadObject {
		const clone = super.clone() as MLine;
		// clone.style = this.style?.clone();
		clone.vertices = this.vertices.map(v => v.clone());
		return clone;
	}

	override getBoundingBox(): any {
		return null;
	}
}

export { MLineFlags } from './MLineFlags.js';

export { MLineJustification } from './MLineJustification.js';
