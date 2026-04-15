import { Entity } from './Entity.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { SplineFlags } from './SplineFlags.js';
import { SplineFlags1 } from './SplineFlags1.js';
import { KnotParametrization } from './KnotParametrization.js';
import { XYZ } from '../Math/XYZ.js';

export class Spline extends Entity {
	controlPoints: XYZ[] = [];

	controlPointTolerance: number = 0.0000001;

	degree: number = 3;

	endTangent: XYZ = new XYZ(0, 0, 0);

	fitPoints: XYZ[] = [];

	fitTolerance: number = 0.0000000001;

	get flags(): SplineFlags {
		return this._flags;
	}
	set flags(value: SplineFlags) {
		this._flags = value;
	}

	get flags1(): SplineFlags1 {
		return this._flags1;
	}
	set flags1(value: SplineFlags1) {
		this._flags1 = value;
	}

	get hasValidKnotCount(): boolean {
		const expected = this.controlPoints.length + (this.isClosed ? 2 : 1) * this.degree + 1;
		return this.knots.length === expected;
	}

	get isClosed(): boolean {
		return (this._flags & SplineFlags.Closed) !== 0;
	}
	set isClosed(value: boolean) {
		if (value) {
			this._flags = this._flags | SplineFlags.Closed;
			this._flags1 = this._flags1 | SplineFlags1.Closed;
		} else {
			this._flags = this._flags & ~SplineFlags.Closed;
			this._flags1 = this._flags1 & ~SplineFlags1.Closed;
		}
	}

	get isPeriodic(): boolean {
		return (this._flags & SplineFlags.Periodic) !== 0;
	}
	set isPeriodic(value: boolean) {
		if (value) {
			this._flags = this._flags | SplineFlags.Periodic;
		} else {
			this._flags = this._flags & ~SplineFlags.Periodic;
		}
	}

	knotParametrization: KnotParametrization = KnotParametrization.Chord;

	knots: number[] = [];

	knotTolerance: number = 0.0000001;

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.EntitySpline;
	}

	override get objectType(): ObjectType {
		return ObjectType.SPLINE;
	}

	startTangent: XYZ = new XYZ(0, 0, 0);

	override get subclassMarker(): string {
		return DxfSubclassMarker.Spline;
	}

	weights: number[] = [];

	static readonly MaxDegree: number = 10;

	private _flags: SplineFlags = SplineFlags.None;
	private _flags1: SplineFlags1 = SplineFlags1.None;

	constructor() {
		super();
	}

	override applyTransform(transform: unknown): void {
		this.controlPoints = this.controlPoints.map((point) => this.applyTransformToPoint(transform, point));
		this.fitPoints = this.fitPoints.map((point) => this.applyTransformToPoint(transform, point));
		this.startTangent = this.applyTransformToVector(transform, this.startTangent);
		this.endTangent = this.applyTransformToVector(transform, this.endTangent);
		this.normal = this.applyTransformToVector(transform, this.normal).normalize();
	}

	override clone(): CadObject {
		const clone = super.clone() as Spline;
		clone.controlPoints = [...this.controlPoints];
		clone.fitPoints = [...this.fitPoints];
		clone.weights = [...this.weights];
		clone.knots = [...this.knots];
		return clone;
	}

	override getBoundingBox(): BoundingBox | null {
		const polygon = this.tryPolygonalVertexes(64);
		if (polygon.success && polygon.points.length > 0) {
			return BoundingBox.FromPoints(polygon.points);
		}

		const points = this.controlPoints.length > 0 ? this.controlPoints : this.fitPoints;
		return points.length > 0 ? BoundingBox.FromPoints(points) : null;
	}

	pointOnSpline(t: number): XYZ {
		if (t < 0 || t > 1) {
			throw new Error('The parametric position must be a value between 0 and 1.');
		}

		if (t === 1) {
			t -= Number.EPSILON;
		}

		const { controlPts, weights, knots } = this.prepare();
		const { uStart, uEnd } = this.getStartAndEndKnots(knots);

		const uDelta = (uEnd - uStart) * t;
		const u = uStart + uDelta;
		return Spline.c(controlPts, weights, knots, this.degree, u);
	}

	polygonalVertexes(precision: number): XYZ[] {
		if (precision < 2) {
			throw new Error('The precision must be equal or greater than two.');
		}

		const vertexes: XYZ[] = [];
		const { controlPts, weights, knots } = this.prepare();
		const { uStart, uEnd } = this.getStartAndEndKnots(knots);

		if (!this.isClosed && !this.isPeriodic) {
			precision -= 1;
		}

		const uDelta = (uEnd - uStart) / precision;

		for (let i = 0; i < precision; i++) {
			const u = uStart + uDelta * i;
			vertexes.push(Spline.c(controlPts, weights, knots, this.degree, u));
		}

		if (!(this.isClosed || this.isPeriodic)) {
			vertexes.push(controlPts[controlPts.length - 1]);
		}

		return vertexes;
	}

	tryPointOnSpline(t: number): { success: boolean; point: XYZ } {
		try {
			const point = this.pointOnSpline(t);
			return { success: true, point };
		} catch {
			return { success: false, point: new XYZ(NaN, NaN, NaN) };
		}
	}

	tryPolygonalVertexes(precision: number): { success: boolean; points: XYZ[] } {
		try {
			const points = this.polygonalVertexes(precision);
			return { success: true, points };
		} catch {
			return { success: false, points: [] };
		}
	}

	updateFromFitPoints(iterationLimit: number = 255): boolean {
		void iterationLimit;
		if (this.fitPoints.length < 2) {
			return false;
		}

		// Fall back to a piecewise-linear spline that preserves fit point order.
		this.degree = 1;
		this.controlPoints = this.fitPoints.map((point) => new XYZ(point.x, point.y, point.z));
		this.weights = new Array(this.controlPoints.length).fill(1);
		this.knots = Spline.createKnotVector(this.controlPoints.length, this.degree, this.isPeriodic);

		if (this.fitPoints.length >= 2) {
			const first = this.fitPoints[0];
			const second = this.fitPoints[1];
			const penultimate = this.fitPoints[this.fitPoints.length - 2];
			const last = this.fitPoints[this.fitPoints.length - 1];
			this.startTangent = new XYZ(second.x - first.x, second.y - first.y, second.z - first.z);
			this.endTangent = new XYZ(last.x - penultimate.x, last.y - penultimate.y, last.z - penultimate.z);
		}

		return true;
	}

	private static c(ctrlPoints: XYZ[], weights: number[], knots: number[], degree: number, u: number): XYZ {
		let sumX = 0, sumY = 0, sumZ = 0;
		let denominatorSum = 0;

		for (let i = 0; i < ctrlPoints.length; i++) {
			const nurb = Spline.computeNurb(knots, i, degree, u);
			denominatorSum += nurb * weights[i];
			sumX += weights[i] * nurb * ctrlPoints[i].x;
			sumY += weights[i] * nurb * ctrlPoints[i].y;
			sumZ += weights[i] * nurb * ctrlPoints[i].z;
		}

		if (Math.abs(denominatorSum) < Number.EPSILON) {
			return new XYZ(0, 0, 0);
		}

		const inv = 1.0 / denominatorSum;
		return new XYZ(inv * sumX, inv * sumY, inv * sumZ);
	}

	private static computeNurb(knots: number[], i: number, p: number, u: number): number {
		if (p <= 0) {
			if (knots[i] <= u && u < knots[i + 1]) {
				return 1;
			}
			return 0.0;
		}

		let leftCoefficient = 0.0;
		if (!(Math.abs(knots[i + p] - knots[i]) < Number.EPSILON)) {
			leftCoefficient = (u - knots[i]) / (knots[i + p] - knots[i]);
		}

		let rightCoefficient = 0.0;
		if (!(Math.abs(knots[i + p + 1] - knots[i + 1]) < Number.EPSILON)) {
			rightCoefficient = (knots[i + p + 1] - u) / (knots[i + p + 1] - knots[i + 1]);
		}

		return leftCoefficient * Spline.computeNurb(knots, i, p - 1, u) +
			rightCoefficient * Spline.computeNurb(knots, i + 1, p - 1, u);
	}

	private static createKnotVector(numControlPoints: number, degree: number, isPeriodic: boolean): number[] {
		let knots: number[];

		if (!isPeriodic) {
			const numKnots = numControlPoints + degree + 1;
			knots = new Array(numKnots).fill(0);

			let i: number;
			for (i = 0; i <= degree; i++) {
				knots[i] = 0.0;
			}
			for (; i < numControlPoints; i++) {
				knots[i] = i - degree;
			}
			for (; i < numKnots; i++) {
				knots[i] = numControlPoints - degree;
			}
		} else {
			const numKnots = numControlPoints + 2 * degree + 1;
			knots = new Array(numKnots).fill(0);
			const factor = 1.0 / (numControlPoints - degree);
			for (let i = 0; i < numKnots; i++) {
				knots[i] = (i - degree) * factor;
			}
		}

		return knots;
	}

	private getStartAndEndKnots(knots: number[]): { uStart: number; uEnd: number } {
		if (this.isClosed) {
			return { uStart: knots[0], uEnd: knots[knots.length - 1] };
		} else if (this.isPeriodic) {
			return { uStart: knots[this.degree], uEnd: knots[knots.length - this.degree - 1] };
		} else {
			return { uStart: knots[0], uEnd: knots[knots.length - 1] };
		}
	}

	private prepare(): { controlPts: XYZ[]; weights: number[]; knots: number[] } {
		if (this.controlPoints.length === 0 && this.fitPoints.length > 0) {
			this.updateFromFitPoints();
		}

		let c = [...this.controlPoints];
		let w = [...this.weights];
		let knots = [...this.knots];

		const numCtrlPoints = c.length;
		if (numCtrlPoints === 0) {
			throw new Error('A spline entity with control points is required.');
		}

		if (w.length === 0 || w.length !== numCtrlPoints) {
			w = new Array(numCtrlPoints).fill(1.0);
		}

		if (knots.length === 0 || !this.hasValidKnotCount) {
			knots = Spline.createKnotVector(numCtrlPoints, this.degree, this.isPeriodic);
		}

		let controlPts: XYZ[];
		let weights: number[];

		if (this.isPeriodic) {
			controlPts = new Array(numCtrlPoints + this.degree);
			weights = new Array(numCtrlPoints + this.degree);
			for (let i = 0; i < this.degree; i++) {
				const index = numCtrlPoints - this.degree + i;
				controlPts[i] = c[index];
				weights[i] = w[index];
			}
			for (let i = 0; i < numCtrlPoints; i++) {
				controlPts[this.degree + i] = c[i];
				weights[this.degree + i] = w[i];
			}
		} else {
			controlPts = c;
			weights = w;
		}

		return { controlPts, weights, knots };
	}
}

export { SplineFlags } from './SplineFlags.js';

export { SplineFlags1 } from './SplineFlags1.js';

export { KnotParametrization } from './KnotParametrization.js';
