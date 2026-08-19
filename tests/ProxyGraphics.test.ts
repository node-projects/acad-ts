import { describe, expect, it } from 'vitest';
import { ProxyCircle, ProxyCirclePt3, ProxyExtents } from '../src/Entities/ProxyGraphics.js';
import { XYZ } from '../src/Math/XYZ.js';

describe('ProxyGraphicsTests', () => {
	it('UsesIndependentMutableVectorDefaults', () => {
		const first = new ProxyCircle();
		const second = new ProxyCircle();
		const points = new ProxyCirclePt3();
		const extents = new ProxyExtents();

		first.center.x = 12;
		first.normal.z = 4;
		points.point1.y = 7;
		extents.min.z = -3;

		expect(second.center).toEqual(new XYZ());
		expect(second.normal).toEqual(new XYZ(0, 0, 1));
		expect(points.point2).toEqual(new XYZ());
		expect(extents.max).toEqual(new XYZ());
		expect(XYZ.zero).toEqual(new XYZ());
		expect(XYZ.axisZ).toEqual(new XYZ(0, 0, 1));
	});
});
