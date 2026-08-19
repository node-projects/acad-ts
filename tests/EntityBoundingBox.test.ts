import { describe, expect, it } from 'vitest';
import { Arc } from '../src/Entities/Arc.js';
import { Ellipse } from '../src/Entities/Ellipse.js';
import { Face3D } from '../src/Entities/Face3D.js';
import { Hatch, HatchBoundaryPath, HatchBoundaryPathArc, HatchBoundaryPathEllipse, HatchBoundaryPathLine, HatchBoundaryPathPolyline } from '../src/Entities/Hatch.js';
import { Leader } from '../src/Entities/Leader.js';
import { Ole2Frame } from '../src/Entities/Ole2Frame.js';
import { Point } from '../src/Entities/Point.js';
import { Polyline2D } from '../src/Entities/Polyline2D.js';
import { Solid } from '../src/Entities/Solid.js';
import { XYZ } from '../src/Math/XYZ.js';
import { XY } from '../src/Math/XY.js';
import { Wall, WallJustification } from '../src/Entities/AecObjects/Wall.js';

describe('EntityBoundingBoxTests', () => {
	it('ReturnsWallPrismBounds', () => {
		const wall = new Wall();
		wall.startPoint = new XYZ(0, 0, 0);
		wall.endPoint = new XYZ(10, 0, 0);
		wall.width = 2;
		wall.height = 3;
		wall.justification = WallJustification.Center;

		const bounds = wall.getBoundingBox();

		expect(bounds.min).toEqual(new XYZ(0, -1, 0));
		expect(bounds.max).toEqual(new XYZ(10, 1, 3));
	});

	it('ReturnsPointBounds', () => {
		const point = new Point(new XYZ(2, 3, 4));
		const bounds = point.getBoundingBox();

		expect(bounds.min.x).toBe(2);
		expect(bounds.min.y).toBe(3);
		expect(bounds.min.z).toBe(4);
		expect(bounds.max.x).toBe(2);
		expect(bounds.max.y).toBe(3);
		expect(bounds.max.z).toBe(4);
	});

	it('ReturnsFace3DBounds', () => {
		const face = new Face3D();
		face.firstCorner = new XYZ(5, 0, 1);
		face.secondCorner = new XYZ(-1, 3, 4);
		face.thirdCorner = new XYZ(2, 7, -2);
		face.fourthCorner = new XYZ(1, -5, 2);

		const bounds = face.getBoundingBox();

		expect(bounds.min.x).toBe(-1);
		expect(bounds.min.y).toBe(-5);
		expect(bounds.min.z).toBe(-2);
		expect(bounds.max.x).toBe(5);
		expect(bounds.max.y).toBe(7);
		expect(bounds.max.z).toBe(4);
	});

	it('ReturnsSolidBounds', () => {
		const solid = new Solid();
		solid.firstCorner = new XYZ(10, 1, 0);
		solid.secondCorner = new XYZ(7, -4, 3);
		solid.thirdCorner = new XYZ(12, 6, -1);
		solid.fourthCorner = new XYZ(8, 2, 5);

		const bounds = solid.getBoundingBox();

		expect(bounds.min.x).toBe(7);
		expect(bounds.min.y).toBe(-4);
		expect(bounds.min.z).toBe(-1);
		expect(bounds.max.x).toBe(12);
		expect(bounds.max.y).toBe(6);
		expect(bounds.max.z).toBe(5);
	});

	it('ReturnsLeaderBounds', () => {
		const leader = new Leader();
		leader.vertices = [
			new XYZ(4, 8, 0),
			new XYZ(-3, 2, 5),
			new XYZ(10, -1, 1),
		];

		const bounds = leader.getBoundingBox();

		expect(bounds.min.x).toBe(-3);
		expect(bounds.min.y).toBe(-1);
		expect(bounds.min.z).toBe(0);
		expect(bounds.max.x).toBe(10);
		expect(bounds.max.y).toBe(8);
		expect(bounds.max.z).toBe(5);
	});

	it('ReturnsOle2FrameBounds', () => {
		const frame = new Ole2Frame();
		frame.upperLeftCorner = new XYZ(-2, 9, 1);
		frame.lowerRightCorner = new XYZ(6, 3, 4);

		const bounds = frame.getBoundingBox();

		expect(bounds.min.x).toBe(-2);
		expect(bounds.min.y).toBe(3);
		expect(bounds.min.z).toBe(1);
		expect(bounds.max.x).toBe(6);
		expect(bounds.max.y).toBe(9);
		expect(bounds.max.z).toBe(4);
	});

	it('ReturnsArcBoundsFromSampledVertices', () => {
		const arc = new Arc(new XYZ(10, 20, 2), 5, 0, Math.PI / 2);

		const bounds = arc.getBoundingBox();

		expect(bounds?.min.x).toBeCloseTo(10);
		expect(bounds?.min.y).toBeCloseTo(20);
		expect(bounds?.min.z).toBe(2);
		expect(bounds?.max.x).toBeCloseTo(15);
		expect(bounds?.max.y).toBeCloseTo(25);
		expect(bounds?.max.z).toBe(2);
	});

	it('ReturnsEllipseBoundsFromSampledVertices', () => {
		const ellipse = new Ellipse();
		ellipse.center = new XYZ(1, 2, 0);
		ellipse.majorAxisEndPoint = new XYZ(4, 0, 0);
		ellipse.radiusRatio = 0.5;
		ellipse.startParameter = 0;
		ellipse.endParameter = Math.PI / 2;

		const bounds = ellipse.getBoundingBox();

		expect(bounds?.min.x).toBeCloseTo(1);
		expect(bounds?.min.y).toBeCloseTo(2);
		expect(bounds?.max.x).toBeCloseTo(5);
		expect(bounds?.max.y).toBeCloseTo(4);
	});

	it('ConvertsHatchEdgesToEntitiesAndBounds', () => {
		const line = new HatchBoundaryPathLine();
		line.start = new XY(0, 0);
		line.end = new XY(4, 3);

		const arc = new HatchBoundaryPathArc();
		arc.center = new XY(10, 10);
		arc.radius = 2;
		arc.startAngle = 0;
		arc.endAngle = Math.PI / 2;
		arc.counterClockWise = true;

		const ellipse = new HatchBoundaryPathEllipse();
		ellipse.center = new XY(-5, -5);
		ellipse.majorAxisEndPoint = new XY(4, 0);
		ellipse.minorToMajorRatio = 0.5;
		ellipse.startAngle = 0;
		ellipse.endAngle = Math.PI / 2;
		ellipse.counterClockWise = true;

		const polyline = new HatchBoundaryPathPolyline();
		polyline.isClosed = true;
		polyline.vertices = [
			new XYZ(0, 0, 0),
			new XYZ(3, 0, 0),
			new XYZ(3, 2, 0),
		];

		expect(line.toEntity().objectName).toBe('LINE');
		expect(arc.toEntity()).toBeInstanceOf(Arc);
		expect(ellipse.toEntity()).toBeInstanceOf(Ellipse);
		expect(polyline.toEntity()).toBeInstanceOf(Polyline2D);
		expect(line.getBoundingBox()).not.toBeNull();
		expect(arc.getBoundingBox()).not.toBeNull();
		expect(ellipse.getBoundingBox()).not.toBeNull();
		expect(polyline.getBoundingBox()).not.toBeNull();
	});

	it('ReturnsHatchBoundsFromBoundaryPaths', () => {
		const path = new HatchBoundaryPath();
		const polyline = new HatchBoundaryPathPolyline();
		polyline.isClosed = true;
		polyline.vertices = [
			new XYZ(-2, 1, 0),
			new XYZ(4, 1, 0),
			new XYZ(4, 6, 0),
			new XYZ(-2, 6, 0),
		];
		path.edges.push(polyline);

		const hatch = new Hatch();
		hatch.paths.push(path);

		const bounds = hatch.getBoundingBox();

		expect(bounds?.min.x).toBe(-2);
		expect(bounds?.min.y).toBe(1);
		expect(bounds?.max.x).toBe(4);
		expect(bounds?.max.y).toBe(6);
	});
});
