import { Circle } from './Circle.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';

export class Arc extends Circle {
	endAngle: number = Math.PI;

	override get objectName(): string {
		return DxfFileToken.EntityArc;
	}

	override get objectType(): ObjectType {
		return ObjectType.ARC;
	}

	startAngle: number = 0.0;

	override get subclassMarker(): string {
		return DxfSubclassMarker.Arc;
	}

	get sweep(): number {
		let start = this.startAngle;
		let end = this.endAngle;
		if (end < start) {
			end += Math.PI * 2;
		}
		return start - end;
	}

	constructor(center?: XYZ, radius?: number, start?: number, end?: number) {
		super();
		if (center !== undefined) {
			this.center = center;
		}
		if (radius !== undefined) {
			this.radius = radius;
		}
		if (start !== undefined) {
			this.startAngle = start;
		}
		if (end !== undefined) {
			this.endAngle = end;
		}
	}

	static createFromBulge(p1: XY, p2: XY, bulge: number): Arc {
		const { center, radius } = Arc.getCenter(p1, p2, bulge);

		let startAngle: number;
		let endAngle: number;
		if (bulge < 0) {
			startAngle = Math.atan2(p2.y - center.y, p2.x - center.x);
			endAngle = Math.atan2(p1.y - center.y, p1.x - center.x);
		} else {
			startAngle = Math.atan2(p1.y - center.y, p1.x - center.x);
			endAngle = Math.atan2(p2.y - center.y, p2.x - center.x);
		}

		const arc = new Arc();
		arc.center = new XYZ(center.x, center.y, 0);
		arc.radius = radius;
		arc.startAngle = startAngle;
		arc.endAngle = endAngle;
		return arc;
	}

	/** @internal */
	static getBulge(center: XY, start: XY, end: XY, clockWise: boolean): number {
		const ux = start.x - center.x;
		const uy = start.y - center.y;
		const u2x = -uy;
		const u2y = ux;
		const vx = end.x - center.x;
		const vy = end.y - center.y;
		let angle = Math.atan2(ux * vx + uy * vy, u2x * vx + u2y * vy);
		if (clockWise) {
			if (angle > 0) {
				angle -= Math.PI * 2.0;
			}
		} else if (angle < 0) {
			angle += Math.PI * 2.0;
		}
		return Math.tan(angle / 4.0);
	}

	/** @internal */
	static getBulgeFromAngle(angle: number): number {
		return Math.tan(angle / 4);
	}

	static getCenter(start: XY, end: XY, bulge: number): { center: XY; radius: number } {
		const theta = 4 * Math.atan(Math.abs(bulge));
		const dx = end.x - start.x;
		const dy = end.y - start.y;
		const c = Math.sqrt(dx * dx + dy * dy) / 2.0;
		const radius = c / Math.sin(theta / 2.0);

		const gamma = (Math.PI - theta) / 2;
		const phi = Math.atan2(dy, dx) + Math.sign(bulge) * gamma;
		const center: XY = new XY(start.x + radius * Math.cos(phi), start.y + radius * Math.sin(phi),);
		return { center, radius };
	}

	override applyTransform(transform: any): void {
		// TODO: Transform operations not available
	}

	override getBoundingBox(): any {
		// TODO: PolygonalVertexes/BoundingBox.FromPoints not available
		return null;
	}

	getEndVertices(): { start: XYZ; end: XYZ } {
		const start: XYZ = new XYZ(this.center.x + this.radius * Math.cos(this.startAngle), this.center.y + this.radius * Math.sin(this.startAngle), 0,);
		const end: XYZ = new XYZ(this.center.x + this.radius * Math.cos(this.endAngle), this.center.y + this.radius * Math.sin(this.endAngle), 0,);
		// TODO: Matrix4.GetArbitraryAxis transform not applied
		return { start, end };
	}

	override polygonalVertexes(precision: number): XYZ[] {
		if (precision < 2) {
			throw new Error('The arc precision must be equal or greater than two.');
		}
		// TODO: CurveExtensions.PolygonalVertexes not available
		return [];
	}
}
