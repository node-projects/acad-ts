import { Arc } from '../Entities/Arc.js';
import { Entity } from '../Entities/Entity.js';
import { IPolyline, IVertex } from '../Entities/IPolyline.js';
import { Line } from '../Entities/Line.js';
import { XY } from '../Math/XY.js';
import { XYZ } from '../Math/XYZ.js';
import type { IVector } from '../Math/IVector.js';

function isXYZ(value: IVector): value is XYZ {
	return value.dimension === 3;
}

export class PolylineExtensions {
	public static explode(polyline: IPolyline): Entity[] {
		const vertices = Array.from(polyline.vertices);
		if (vertices.length < 2) {
			return [];
		}

		const segmentCount = polyline.isClosed ? vertices.length : vertices.length - 1;
		const entities: Entity[] = [];
		for (let index = 0; index < segmentCount; index++) {
			const current = vertices[index];
			const next = vertices[(index + 1) % vertices.length];
			const entity = this.createSegment(polyline, current, next);
			if (entity != null) {
				entities.push(entity);
			}
		}

		return entities;
	}

	public static getPoints<T extends XY | XYZ = XYZ>(polyline: IPolyline): T[];
	public static getPoints<T extends XY | XYZ = XYZ>(polyline: IPolyline, precision: number): T[];
	public static getPoints<T extends XY | XYZ = XYZ>(polyline: IPolyline, precision: number = 256): T[] {
		const vertices = Array.from(polyline.vertices);
		if (vertices.length === 0) {
			return [];
		}
		if (vertices.length === 1) {
			return [this.toXYZ(vertices[0].location, polyline.elevation) as T];
		}

		const segmentCount = polyline.isClosed ? vertices.length : vertices.length - 1;
		const points: XYZ[] = [];
		for (let index = 0; index < segmentCount; index++) {
			const current = vertices[index];
			const next = vertices[(index + 1) % vertices.length];
			const segmentPoints = this.getSegmentPoints(polyline, current, next, precision);
			if (index > 0 && segmentPoints.length > 0) {
				segmentPoints.shift();
			}
			points.push(...segmentPoints);
		}

		if (points.length === 0) {
			points.push(...vertices.map((vertex) => this.toXYZ(vertex.location, polyline.elevation)));
		}

		if (polyline.isClosed && points.length > 1 && XYZ.equals(points[0], points[points.length - 1])) {
			points.pop();
		}

		return points as T[];
	}

	private static createSegment(polyline: IPolyline, current: IVertex, next: IVertex): Entity | null {
		const bulge = current.bulge ?? 0;
		const elevation = this.getElevation(polyline, current, next);
		const startPoint = this.toXYZ(current.location, elevation);
		const endPoint = this.toXYZ(next.location, elevation);

		if (Math.abs(bulge) < 1e-12) {
			const line = new Line(startPoint, endPoint);
			line.thickness = polyline.thickness;
			line.normal = polyline.normal;
			if (polyline instanceof Entity) {
				line.matchProperties(polyline);
			}
			return line;
		}

		const arc = Arc.createFromBulge(this.toXY(current.location), this.toXY(next.location), bulge);
		arc.center.z = elevation;
		arc.normal = polyline.normal;
		arc.thickness = polyline.thickness;
		if (polyline instanceof Entity) {
			arc.matchProperties(polyline);
		}
		return arc;
	}

	private static getSegmentPoints(polyline: IPolyline, current: IVertex, next: IVertex, precision: number): XYZ[] {
		const bulge = current.bulge ?? 0;
		const elevation = this.getElevation(polyline, current, next);
		const start = this.toXYZ(current.location, elevation);
		const end = this.toXYZ(next.location, elevation);

		if (Math.abs(bulge) < 1e-12) {
			return [start, end];
		}

		const startXY = this.toXY(current.location);
		const endXY = this.toXY(next.location);
		const { center, radius } = Arc.getCenter(startXY, endXY, bulge);
		let startAngle = Math.atan2(startXY.y - center.y, startXY.x - center.x);
		let endAngle = Math.atan2(endXY.y - center.y, endXY.x - center.x);

		if (bulge > 0 && endAngle < startAngle) {
			endAngle += Math.PI * 2;
		} else if (bulge < 0 && endAngle > startAngle) {
			endAngle -= Math.PI * 2;
		}

		const steps = Math.max(2, Math.floor(precision));
		const increment = (endAngle - startAngle) / (steps - 1);
		const points: XYZ[] = [];
		for (let index = 0; index < steps; index++) {
			const angle = startAngle + increment * index;
			points.push(new XYZ(
				center.x + radius * Math.cos(angle),
				center.y + radius * Math.sin(angle),
				elevation,
			));
		}

		points[0] = start;
		points[points.length - 1] = end;

		return points;
	}

	private static getElevation(polyline: IPolyline, current: IVertex, next: IVertex): number {
		if (isXYZ(current.location)) {
			return current.location.z;
		}
		if (isXYZ(next.location)) {
			return next.location.z;
		}
		return polyline.elevation;
	}

	private static toXY(location: IVector): XY {
		return new XY((location as XY | XYZ).x, (location as XY | XYZ).y);
	}

	private static toXYZ(location: IVector, elevation: number): XYZ {
		const point = location as XY | XYZ;
		return new XYZ(point.x, point.y, isXYZ(location) ? location.z : elevation);
	}
}
