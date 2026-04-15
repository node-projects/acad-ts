import { describe, expect, it } from 'vitest';
import { Face3D } from '../src/Entities/Face3D.js';
import { Leader } from '../src/Entities/Leader.js';
import { Ole2Frame } from '../src/Entities/Ole2Frame.js';
import { Point } from '../src/Entities/Point.js';
import { Solid } from '../src/Entities/Solid.js';
import { XYZ } from '../src/Math/XYZ.js';

describe('EntityBoundingBoxTests', () => {
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
});