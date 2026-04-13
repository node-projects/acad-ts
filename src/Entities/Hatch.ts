import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { HatchGradientPattern } from './HatchGradientPattern.js';
import { HatchPattern } from './HatchPattern.js';
import { HatchPatternType } from './HatchPatternType.js';
import { HatchStyleType } from './HatchStyleType.js';
import { BoundaryPathFlags } from './BoundaryPathFlags.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';

export enum EdgeType {
	Polyline = 0,
	Line = 1,
	CircularArc = 2,
	EllipticArc = 3,
	Spline = 4,
}

export abstract class HatchBoundaryPathEdge {
	abstract get type(): EdgeType;
	abstract applyTransform(transform: any): void;
	clone(): HatchBoundaryPathEdge {
		return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
	}
	abstract getBoundingBox(): any;
	abstract toEntity(): Entity;
}

export class HatchBoundaryPathArc extends HatchBoundaryPathEdge {
	center: XY = new XY(0, 0);
	counterClockWise: boolean = false;
	endAngle: number = 0;
	radius: number = 0;
	startAngle: number = 0;

	override get type(): EdgeType { return EdgeType.CircularArc; }

	override applyTransform(transform: any): void {
		// TODO: Transform
	}

	override getBoundingBox(): any { return null; }

	polygonalVertexes(precision: number): XYZ[] {
		// TODO: Arc.PolygonalVertexes
		return [];
	}

	override toEntity(): Entity {
		// TODO: Create Arc entity
		return null as any;
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

	override applyTransform(transform: any): void {
		// TODO: Transform
	}

	override getBoundingBox(): any { return null; }

	polygonalVertexes(precision: number): XYZ[] {
		return [];
	}

	override toEntity(): Entity {
		// TODO: Create Ellipse entity
		return null as any;
	}
}

export class HatchBoundaryPathLine extends HatchBoundaryPathEdge {
	end: XY = new XY(0, 0);
	start: XY = new XY(0, 0);

	override get type(): EdgeType { return EdgeType.Line; }

	override applyTransform(transform: any): void {
		// TODO: Transform
	}

	override getBoundingBox(): any { return null; }

	override toEntity(): Entity {
		// TODO: Create Line entity
		return null as any;
	}
}

export class HatchBoundaryPathPolyline extends HatchBoundaryPathEdge {
	get bulges(): number[] { return this.vertices.map(v => v.z); }
	get hasBulge(): boolean { return this.bulges.some(b => b !== 0); }
	isClosed: boolean = false;
	override get type(): EdgeType { return EdgeType.Polyline; }
	vertices: XYZ[] = [];

	override applyTransform(transform: any): void {
		// TODO: Transform
	}

	override clone(): HatchBoundaryPathPolyline {
		const c = super.clone() as HatchBoundaryPathPolyline;
		c.vertices = [...this.vertices];
		return c;
	}

	override getBoundingBox(): any { return null; }

	override toEntity(): Entity {
		// TODO: Create Polyline2D entity
		return null as any;
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

	override applyTransform(transform: any): void {
		// TODO: Transform
	}

	override clone(): HatchBoundaryPathSpline {
		const c = super.clone() as HatchBoundaryPathSpline;
		c.controlPoints = [...this.controlPoints];
		c.fitPoints = [...this.fitPoints];
		c.knots = [...this.knots];
		return c;
	}

	override getBoundingBox(): any { return null; }

	polygonalVertexes(precision: number): XYZ[] {
		return [];
	}

	override toEntity(): Entity {
		// TODO: Create Spline entity
		return null as any;
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

	applyTransform(transform: any): void {
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

	getBoundingBox(): any {
		return null;
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
			} else if (edge instanceof HatchBoundaryPathSpline) {
				pts.push(...edge.polygonalVertexes(precision));
			}
		}
		return pts;
	}

	updateEdges(): void {
		if (this.entities.length === 0) return;
		this.edges = [];
		// TODO: Convert entities to edges
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
		return DxfFileToken.EntityHatch;
	}

	override get objectType(): ObjectType {
		return ObjectType.HATCH;
	}

	paths: HatchBoundaryPath[] = [];

	pattern: HatchPattern = HatchPattern.Solid;

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
		return DxfSubclassMarker.Hatch;
	}

	private _patternAngle: number = 0;
	private _patternScale: number = 0;

	override applyTransform(transform: any): void {
		for (const p of this.paths) {
			p.applyTransform(transform);
		}
		// TODO: Pattern angle/scale recalculation
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

	override getBoundingBox(): any {
		return null;
	}
}

export { HatchPattern } from './HatchPattern.js';

export { HatchStyleType } from './HatchStyleType.js';

export { HatchPatternType } from './HatchPatternType.js';

export { BoundaryPathFlags } from './BoundaryPathFlags.js';

export { HatchGradientPattern } from './HatchGradientPattern.js';
