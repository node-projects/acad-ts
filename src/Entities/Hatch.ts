import { Entity } from './Entity.js';
import { Arc } from './Arc.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { Ellipse } from './Ellipse.js';
import { Line } from './Line.js';
import { LwPolyline } from './LwPolyline.js';
import { ObjectType } from '../Types/ObjectType.js';
import { HatchGradientPattern } from './HatchGradientPattern.js';
import { HatchPattern } from './HatchPattern.js';
import { HatchPatternType } from './HatchPatternType.js';
import { HatchStyleType } from './HatchStyleType.js';
import { BoundaryPathFlags } from './BoundaryPathFlags.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { Polyline2D } from './Polyline2D.js';
import { Spline } from './Spline.js';
import { Vertex2D } from './Vertex2D.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';
import { Transform } from '../Math/Transform.js';

function transformXYPoint(transform: Transform, point: XY): XY {
	const transformed = transform.applyTransform(new XYZ(point.x, point.y, 0));
	return new XY(transformed.x, transformed.y);
}

function transformXYZVector(transform: Transform, vector: XYZ): XYZ {
	const origin = transform.applyTransform(XYZ.zero);
	const transformed = transform.applyTransform(vector);
	return new XYZ(
		transformed.x - origin.x,
		transformed.y - origin.y,
		transformed.z - origin.z,
	);
}

function getTransformAxisScale(transform: Transform): XYZ {
	const matrix = transform.matrix;
	return new XYZ(
		Math.hypot(matrix.m00, matrix.m10, matrix.m20),
		Math.hypot(matrix.m01, matrix.m11, matrix.m21),
		Math.hypot(matrix.m02, matrix.m12, matrix.m22),
	);
}

export enum EdgeType {
	Polyline = 0,
	Line = 1,
	CircularArc = 2,
	EllipticArc = 3,
	Spline = 4,
}

export abstract class HatchBoundaryPathEdge {
	abstract get type(): EdgeType;
	abstract applyTransform(transform: unknown): void;
	clone(): HatchBoundaryPathEdge {
		return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
	}
	abstract getBoundingBox(): BoundingBox | null;
	abstract toEntity(): Entity;
}

export class HatchBoundaryPathArc extends HatchBoundaryPathEdge {
	center: XY = new XY(0, 0);
	counterClockWise: boolean = false;
	endAngle: number = 0;
	radius: number = 0;
	startAngle: number = 0;

	override get type(): EdgeType { return EdgeType.CircularArc; }

	override applyTransform(transform: unknown): void {
		if (!(transform instanceof Transform)) {
			return;
		}

		const originalCounterClockWise = this.counterClockWise;
		const arc = this.toEntity() as Arc;
		arc.applyTransform(transform);
		this.center = new XY(arc.center.x, arc.center.y);
		this.radius = arc.radius;
		this.startAngle = originalCounterClockWise ? arc.startAngle : arc.endAngle;
		this.endAngle = originalCounterClockWise ? arc.endAngle : arc.startAngle;
	}

	override getBoundingBox(): BoundingBox | null {
		const points = this.polygonalVertexes(64);
		return points.length > 0 ? BoundingBox.fromPoints(points) : null;
	}

	polygonalVertexes(precision: number): XYZ[] {
		return (this.toEntity() as Arc).polygonalVertexes(precision);
	}

	override toEntity(): Entity {
		const startAngle = this.counterClockWise ? this.startAngle : this.endAngle;
		const endAngle = this.counterClockWise ? this.endAngle : this.startAngle;
		const arc = new Arc(new XYZ(this.center.x, this.center.y, 0), this.radius, startAngle, endAngle);
		return arc;
	}
}

export class HatchBoundaryPathEllipse extends HatchBoundaryPathEdge {
	center: XY = new XY(0, 0);
	counterClockWise: boolean = false;
	endAngle: number = 0;
	majorAxisEndPoint: XY = new XY(0, 0);
	minorToMajorRatio: number = 0;
	startAngle: number = 0;

	override get type(): EdgeType { return EdgeType.EllipticArc; }

	override applyTransform(transform: unknown): void {
		if (!(transform instanceof Transform)) {
			return;
		}

		const originalCounterClockWise = this.counterClockWise;
		const ellipse = this.toEntity() as Ellipse;
		ellipse.applyTransform(transform);
		this.center = new XY(ellipse.center.x, ellipse.center.y);
		this.majorAxisEndPoint = new XY(ellipse.majorAxisEndPoint.x, ellipse.majorAxisEndPoint.y);
		this.minorToMajorRatio = ellipse.radiusRatio;
		this.startAngle = originalCounterClockWise ? ellipse.startParameter : ellipse.endParameter;
		this.endAngle = originalCounterClockWise ? ellipse.endParameter : ellipse.startParameter;
	}

	override getBoundingBox(): BoundingBox | null {
		const points = this.polygonalVertexes(64);
		return points.length > 0 ? BoundingBox.fromPoints(points) : null;
	}

	polygonalVertexes(precision: number): XYZ[] {
		return (this.toEntity() as Ellipse).polygonalVertexes(precision);
	}

	override toEntity(): Entity {
		const ellipse = new Ellipse();
		ellipse.center = new XYZ(this.center.x, this.center.y, 0);
		ellipse.majorAxisEndPoint = new XYZ(this.majorAxisEndPoint.x, this.majorAxisEndPoint.y, 0);
		ellipse.radiusRatio = this.minorToMajorRatio;
		ellipse.startParameter = this.counterClockWise ? this.startAngle : this.endAngle;
		ellipse.endParameter = this.counterClockWise ? this.endAngle : this.startAngle;
		return ellipse;
	}
}

export class HatchBoundaryPathLine extends HatchBoundaryPathEdge {
	end: XY = new XY(0, 0);
	start: XY = new XY(0, 0);

	override get type(): EdgeType { return EdgeType.Line; }

	override applyTransform(transform: unknown): void {
		if (!(transform instanceof Transform)) {
			return;
		}

		this.start = transformXYPoint(transform, this.start);
		this.end = transformXYPoint(transform, this.end);
	}

	override getBoundingBox(): BoundingBox {
		return BoundingBox.fromPoints([
			new XYZ(this.start.x, this.start.y, 0),
			new XYZ(this.end.x, this.end.y, 0),
		]);
	}

	override toEntity(): Entity {
		return new Line(new XYZ(this.start.x, this.start.y, 0), new XYZ(this.end.x, this.end.y, 0));
	}
}

export class HatchBoundaryPathPolyline extends HatchBoundaryPathEdge {
	get bulges(): number[] { return this.vertices.map(v => v.z); }
	get hasBulge(): boolean { return this.bulges.some(b => b !== 0); }
	isClosed: boolean = false;
	override get type(): EdgeType { return EdgeType.Polyline; }
	vertices: XYZ[] = [];

	override applyTransform(transform: unknown): void {
		if (!(transform instanceof Transform)) {
			return;
		}

		this.vertices = this.vertices.map((vertex) => {
			const point = transform.applyTransform(new XYZ(vertex.x, vertex.y, 0));
			return new XYZ(point.x, point.y, vertex.z);
		});
	}

	override clone(): HatchBoundaryPathPolyline {
		const c = super.clone() as HatchBoundaryPathPolyline;
		c.vertices = [...this.vertices];
		return c;
	}

	override getBoundingBox(): BoundingBox | null {
		const polyline = this.toEntity() as Polyline2D;
		return polyline.getBoundingBox();
	}

	override toEntity(): Entity {
		const polyline = new Polyline2D();
		polyline.isClosed = this.isClosed;
		for (const vertexData of this.vertices) {
			const vertex = new Vertex2D(new XYZ(vertexData.x, vertexData.y, 0));
			vertex.bulge = vertexData.z;
			polyline.vertices.push(vertex);
		}
		return polyline;
	}
}

export class HatchBoundaryPathSpline extends HatchBoundaryPathEdge {
	controlPoints: XYZ[] = [];
	degree: number = 0;
	endTangent: XY = new XY(0, 0);
	fitPoints: XY[] = [];
	knots: number[] = [];
	isPeriodic: boolean = false;
	isRational: boolean = false;
	startTangent: XY = new XY(0, 0);
	get weights(): number[] { return this.controlPoints.map(c => c.z); }

	override get type(): EdgeType { return EdgeType.Spline; }

	override applyTransform(transform: unknown): void {
		if (!(transform instanceof Transform)) {
			return;
		}

		this.controlPoints = this.controlPoints.map((point) => {
			const transformed = transform.applyTransform(new XYZ(point.x, point.y, 0));
			return new XYZ(transformed.x, transformed.y, point.z);
		});
		this.fitPoints = this.fitPoints.map((point) => transformXYPoint(transform, point));
		const startTangent = transformXYZVector(transform, new XYZ(this.startTangent.x, this.startTangent.y, 0));
		const endTangent = transformXYZVector(transform, new XYZ(this.endTangent.x, this.endTangent.y, 0));
		this.startTangent = new XY(startTangent.x, startTangent.y);
		this.endTangent = new XY(endTangent.x, endTangent.y);
	}

	override clone(): HatchBoundaryPathSpline {
		const c = super.clone() as HatchBoundaryPathSpline;
		c.controlPoints = [...this.controlPoints];
		c.fitPoints = [...this.fitPoints];
		c.knots = [...this.knots];
		return c;
	}

	override getBoundingBox(): BoundingBox | null {
		const spline = this.toEntity() as Spline;
		return spline.getBoundingBox();
	}

	polygonalVertexes(precision: number): XYZ[] {
		const spline = this.toEntity() as Spline;
		const polygon = spline.tryPolygonalVertexes(precision);
		return polygon.success ? polygon.points : [];
	}

	override toEntity(): Entity {
		const spline = new Spline();
		spline.degree = Math.max(1, this.degree);
		spline.isPeriodic = this.isPeriodic;
		spline.knots = [...this.knots];
		spline.controlPoints = (this.controlPoints.length > 0
			? this.controlPoints.map((point) => new XYZ(point.x, point.y, 0))
			: this.fitPoints.map((point) => new XYZ(point.x, point.y, 0)));
		spline.weights = this.controlPoints.length > 0
			? this.controlPoints.map((point) => point.z === 0 ? 1 : point.z)
			: new Array(spline.controlPoints.length).fill(1);
		spline.fitPoints = this.fitPoints.map((point) => new XYZ(point.x, point.y, 0));
		spline.startTangent = new XYZ(this.startTangent.x, this.startTangent.y, 0);
		spline.endTangent = new XYZ(this.endTangent.x, this.endTangent.y, 0);
		return spline;
	}
}

export class HatchBoundaryPath {
	edges: HatchBoundaryPathEdge[] = [];
	entities: Entity[] = [];

	get flags(): BoundaryPathFlags {
		let f = this._flags;
		if (this.isPolyline) {
			f = f | BoundaryPathFlags.Polyline;
		} else {
			f = f & ~BoundaryPathFlags.Polyline;
		}
		return f;
	}
	set flags(value: BoundaryPathFlags) {
		this._flags = value;
	}

	get isPolyline(): boolean {
		return this.edges.some(e => e instanceof HatchBoundaryPathPolyline);
	}

	private _flags: BoundaryPathFlags = 0;

	constructor(edges?: HatchBoundaryPathEdge[]) {
		if (edges) {
			this.edges = [...edges];
		}
	}

	applyTransform(transform: unknown): void {
		if (this.entities.length > 0) {
			for (const entity of this.entities) {
				entity.applyTransform(transform);
			}
			if (this.edges.length === 0) {
				this.updateEdges();
			}
		}

		for (const e of this.edges) {
			e.applyTransform(transform);
		}
	}

	clone(): HatchBoundaryPath {
		const path = new HatchBoundaryPath();
		path._flags = this._flags;
		path.entities = this.entities.map(e => e.clone() as Entity);
		path.edges = this.edges.map(e => e.clone());
		return path;
	}

	getBoundingBox(): BoundingBox | null {
		const boxes = this.edges
			.map((edge) => edge.getBoundingBox())
			.filter((box): box is BoundingBox => box != null);
		if (boxes.length === 0) {
			return null;
		}

		const points = boxes.flatMap((box) => [box.min, box.max]);
		return BoundingBox.fromPoints(points);
	}

	getPoints(precision: number = 256): XYZ[] {
		const pts: XYZ[] = [];
		for (const edge of this.edges) {
			if (edge instanceof HatchBoundaryPathArc) {
				pts.push(...edge.polygonalVertexes(precision));
			} else if (edge instanceof HatchBoundaryPathEllipse) {
				pts.push(...edge.polygonalVertexes(precision));
			} else if (edge instanceof HatchBoundaryPathLine) {
				pts.push(new XYZ(edge.start.x, edge.start.y, 0));
				pts.push(new XYZ(edge.end.x, edge.end.y, 0));
			} else if (edge instanceof HatchBoundaryPathPolyline) {
				pts.push(...(edge.toEntity() as Polyline2D).getPoints(precision));
			} else if (edge instanceof HatchBoundaryPathSpline) {
				pts.push(...edge.polygonalVertexes(precision));
			}
		}
		return pts;
	}

	updateEdges(): void {
		if (this.entities.length === 0) return;
		this.edges = [];
		for (const entity of this.entities) {
			if (entity instanceof Line) {
				const line = new HatchBoundaryPathLine();
				line.start = new XY(entity.startPoint.x, entity.startPoint.y);
				line.end = new XY(entity.endPoint.x, entity.endPoint.y);
				this.edges.push(line);
			} else if (entity instanceof Arc) {
				const arc = new HatchBoundaryPathArc();
				arc.center = new XY(entity.center.x, entity.center.y);
				arc.radius = entity.radius;
				arc.startAngle = entity.startAngle;
				arc.endAngle = entity.endAngle;
				arc.counterClockWise = true;
				this.edges.push(arc);
			} else if (entity instanceof Ellipse) {
				const ellipse = new HatchBoundaryPathEllipse();
				ellipse.center = new XY(entity.center.x, entity.center.y);
				ellipse.majorAxisEndPoint = new XY(entity.majorAxisEndPoint.x, entity.majorAxisEndPoint.y);
				ellipse.minorToMajorRatio = entity.radiusRatio;
				ellipse.startAngle = entity.startParameter;
				ellipse.endAngle = entity.endParameter;
				ellipse.counterClockWise = true;
				this.edges.push(ellipse);
			} else if (entity instanceof Polyline2D) {
				const polyline = new HatchBoundaryPathPolyline();
				polyline.isClosed = entity.isClosed;
				polyline.vertices = entity.vertices
					.filter((vertex): vertex is Vertex2D => vertex instanceof Vertex2D)
					.map((vertex) => new XYZ(vertex.location.x, vertex.location.y, vertex.bulge));
				this.edges.push(polyline);
			} else if (entity instanceof LwPolyline) {
				const polyline = new HatchBoundaryPathPolyline();
				polyline.isClosed = entity.isClosed;
				polyline.vertices = entity.vertices.map((vertex) => new XYZ(vertex.location.x, vertex.location.y, vertex.bulge));
				this.edges.push(polyline);
			} else if (entity instanceof Spline) {
				const spline = new HatchBoundaryPathSpline();
				spline.degree = entity.degree;
				spline.isPeriodic = entity.isPeriodic;
				spline.knots = [...entity.knots];
				spline.controlPoints = entity.controlPoints.map((point, index) => new XYZ(point.x, point.y, entity.weights[index] ?? 1));
				spline.fitPoints = entity.fitPoints.map((point) => new XY(point.x, point.y));
				spline.startTangent = new XY(entity.startTangent.x, entity.startTangent.y);
				spline.endTangent = new XY(entity.endTangent.x, entity.endTangent.y);
				this.edges.push(spline);
			}
		}
	}
}

export class Hatch extends Entity {
	elevation: number = 0;

	gradientColor: HatchGradientPattern = new HatchGradientPattern();

	isAssociative: boolean = false;

	isDouble: boolean = false;

	isSolid: boolean = false;

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.entityHatch;
	}

	override get objectType(): ObjectType {
		return ObjectType.HATCH;
	}

	paths: HatchBoundaryPath[] = [];

	pattern: HatchPattern = HatchPattern.solid;

	get patternAngle(): number {
		return this._patternAngle;
	}
	set patternAngle(value: number) {
		this._patternAngle = value;
		this.pattern?.update(new XY(0, 0), this._patternAngle, 1);
	}

	get patternScale(): number {
		return this._patternScale;
	}
	set patternScale(value: number) {
		this._patternScale = value;
		this.pattern?.update(new XY(0, 0), 0, this._patternScale);
	}

	patternType: HatchPatternType = HatchPatternType.PatternFill;

	pixelSize: number = 0;

	seedPoints: XY[] = [];

	style: HatchStyleType = HatchStyleType.Normal;

	override get subclassMarker(): string {
		return DxfSubclassMarker.hatch;
	}

	private _patternAngle: number = 0;
	private _patternScale: number = 0;

	override applyTransform(transform: unknown): void {
		for (const p of this.paths) {
			p.applyTransform(transform);
		}
		if (transform instanceof Transform) {
			this.seedPoints = this.seedPoints.map((point) => transformXYPoint(transform, point));
			this.normal = this.applyTransformToVector(transform, this.normal).normalize();
			this.elevation = this.applyTransformToPoint(transform, new XYZ(0, 0, this.elevation)).z;
			const transformedOrigin = transformXYPoint(transform, XY.zero);
			const transformedAxis = transformXYZVector(transform, XYZ.axisX);
			const patternRotation = Math.atan2(transformedAxis.y, transformedAxis.x);
			const patternScale = Math.hypot(transformedAxis.x, transformedAxis.y) || 1;
			this.pattern?.update(transformedOrigin, patternRotation, patternScale);
			this._patternAngle += patternRotation;
			this._patternScale = this._patternScale === 0 ? patternScale : this._patternScale * patternScale;
		}
	}

	override clone(): CadObject {
		const clone = super.clone() as Hatch;
		clone.gradientColor = this.gradientColor?.clone();
		clone.pattern = this.pattern?.clone();
		clone.paths = this.paths.map(p => p.clone());
		return clone;
	}

	*explode(): IterableIterator<Entity> {
		for (const b of this.paths) {
			for (const e of b.edges) {
				yield e.toEntity();
			}
		}
	}

	override getBoundingBox(): BoundingBox | null {
		const boxes = this.paths
			.map((path) => path.getBoundingBox())
			.filter((box): box is BoundingBox => box != null);
		if (boxes.length === 0) {
			return null;
		}

		return BoundingBox.fromPoints(boxes.flatMap((box) => [box.min, box.max]));
	}
}

export { HatchPattern } from './HatchPattern.js';

export { HatchStyleType } from './HatchStyleType.js';

export { HatchPatternType } from './HatchPatternType.js';

export { BoundaryPathFlags } from './BoundaryPathFlags.js';

export { HatchGradientPattern } from './HatchGradientPattern.js';
