import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import type { CadDocument } from '../CadDocument.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { MLineFlags } from './MLineFlags.js';
import { MLineJustification } from './MLineJustification.js';
import { Transform } from '../Math/Transform.js';
import { MLineStyle } from '../Objects/MLineStyle.js';
import { XYZ } from '../Math/XYZ.js';

function transformPoint(transform: Transform, point: XYZ): XYZ {
	return transform.applyTransform(point);
}

function transformVector(transform: Transform, vector: XYZ): XYZ {
	const origin = transform.applyTransform(XYZ.zero);
	const transformed = transform.applyTransform(vector);
	return new XYZ(
		transformed.x - origin.x,
		transformed.y - origin.y,
		transformed.z - origin.z,
	);
}

function getAverageScale(transform: Transform): number {
	const matrix = transform.matrix;
	const sx = Math.hypot(matrix.m00, matrix.m10, matrix.m20);
	const sy = Math.hypot(matrix.m01, matrix.m11, matrix.m21);
	const sz = Math.hypot(matrix.m02, matrix.m12, matrix.m22);
	const values = [sx, sy, sz].filter((value) => value > 0);
	return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 1;
}

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

	applyTransform(transform: unknown): void {
		if (!(transform instanceof Transform)) {
			return;
		}

		const previousMiterLength = this.miter.getLength();
		this.position = transformPoint(transform, this.position);
		this.direction = transformVector(transform, this.direction);
		this.miter = transformVector(transform, this.miter);

		const nextMiterLength = this.miter.getLength();
		const scale = previousMiterLength > 0 ? nextMiterLength / previousMiterLength : getAverageScale(transform);
		for (const segment of this.segments) {
			segment.applyScale(scale);
		}
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
		return DxfFileToken.entityMLine;
	}

	override get objectType(): ObjectType {
		return ObjectType.MLINE;
	}

	scaleFactor: number = 1;

	startPoint: XYZ = new XYZ(0, 0, 0);

	get style(): MLineStyle | null { return this._style; }
	set style(value: MLineStyle | null) {
		if (!value) throw new Error('MLine style cannot be null');
		this._style = CadObject.updateCollection(value, this.document?.mLineStyles ?? null);
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.mLine;
	}

	vertices: MLineVertex[] = [];

	private _style: MLineStyle | null = null;

	override applyTransform(transform: unknown): void {
		this.startPoint = this.applyTransformToPoint(transform, this.startPoint);
		this.normal = this.transformNormal(transform, this.normal);
		for (const vertex of this.vertices) {
			vertex.applyTransform(transform);
		}

		if (transform instanceof Transform) {
			this.scaleFactor *= getAverageScale(transform);
		}
	}

	override clone(): CadObject {
		const clone = super.clone() as MLine;
		clone._style = this.style?.clone() as MLineStyle | null ?? null;
		clone.vertices = this.vertices.map(v => v.clone());
		return clone;
	}

	override getBoundingBox(): BoundingBox {
		const points = [this.startPoint, ...this.vertices.map((vertex) => vertex.position)];
		return BoundingBox.fromPoints(points);
	}

	/** @internal */
	assignDocument(doc: CadDocument): void {
		super.assignDocument(doc);
		this._style = CadObject.updateCollection(this._style, doc.mLineStyles);
	}

	/** @internal */
	unassignDocument(): void {
		super.unassignDocument();
		this._style = this._style?.clone() as MLineStyle | null ?? null;
	}
}

export { MLineFlags } from './MLineFlags.js';

export { MLineJustification } from './MLineJustification.js';
