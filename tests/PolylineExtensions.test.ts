import { describe, expect, it } from 'vitest';
import { Arc } from '../src/Entities/Arc.js';
import { Line } from '../src/Entities/Line.js';
import { LwPolyline, LwPolylineVertex } from '../src/Entities/LwPolyline.js';
import { Polyline2D } from '../src/Entities/Polyline2D.js';
import { Polyline3D } from '../src/Entities/Polyline3D.js';
import { Vertex2D } from '../src/Entities/Vertex2D.js';
import { XY } from '../src/Math/XY.js';
import { XYZ } from '../src/Math/XYZ.js';
import { PolylineExtensions } from '../src/Extensions/PolylineExtensions.js';

describe('PolylineExtensionsTests', () => {
	it('GetsPointsForBulgedLwPolylines', () => {
		const first = new LwPolylineVertex(new XY(0, 0));
		const second = new LwPolylineVertex(new XY(2, 0));
		first.bulge = 1;

		const polyline = new LwPolyline([first, second]);
		polyline.elevation = 5;

		const points = polyline.getPoints(5);

		expect(points).toHaveLength(5);
		expect(points[0]).toEqual(new XYZ(0, 0, 5));
		expect(points[points.length - 1]).toEqual(new XYZ(2, 0, 5));
		expect(points.some((point) => Math.abs(point.y) > 0.001)).toBe(true);
	});

	it('ExplodesPolylinesIntoLineAndArcSegments', () => {
		const first = new LwPolylineVertex(new XY(0, 0));
		const second = new LwPolylineVertex(new XY(2, 0));
		const third = new LwPolylineVertex(new XY(4, 0));
		second.bulge = 1;

		const polyline = new LwPolyline([first, second, third]);
		polyline.elevation = 3;

		const entities = PolylineExtensions.explode(polyline);

		expect(entities).toHaveLength(2);
		expect(entities[0]).toBeInstanceOf(Line);
		expect(entities[1]).toBeInstanceOf(Arc);
		expect((entities[1] as Arc).center.z).toBe(3);
	});

	it('BuildsBoundingBoxesFromPolylinePoints', () => {
		const polyline3d = new Polyline3D([
			new XYZ(1, 4, 3),
			new XYZ(-2, 8, 7),
			new XYZ(6, -1, 5),
		]);
		const polyline2d = new Polyline2D([
			new Vertex2D(new XYZ(10, 2, 0)),
			new Vertex2D(new XYZ(14, 9, 0)),
		]);

		const bounds3d = polyline3d.getBoundingBox();
		const bounds2d = polyline2d.getBoundingBox();

		expect(bounds3d?.min).toEqual(new XYZ(-2, -1, 3));
		expect(bounds3d?.max).toEqual(new XYZ(6, 8, 7));
		expect(bounds2d?.min).toEqual(new XYZ(10, 2, 0));
		expect(bounds2d?.max).toEqual(new XYZ(14, 9, 0));
	});
});