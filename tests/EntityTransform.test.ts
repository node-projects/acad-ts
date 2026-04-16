import { describe, expect, it } from 'vitest';
import { Arc } from '../src/Entities/Arc.js';
import { Ellipse } from '../src/Entities/Ellipse.js';
import { Hatch, HatchBoundaryPath, HatchBoundaryPathLine } from '../src/Entities/Hatch.js';
import { HatchPattern, HatchPatternLine } from '../src/Entities/HatchPattern.js';
import { Insert } from '../src/Entities/Insert.js';
import { Line } from '../src/Entities/Line.js';
import { XYZ } from '../src/Math/XYZ.js';
import { XY } from '../src/Math/XY.js';
import { BlockRecord } from '../src/Tables/BlockRecord.js';

describe('EntityTransformTests', () => {
	it('AppliesBaseRotationWrapperToEllipse', () => {
		const ellipse = new Ellipse();
		ellipse.center = new XYZ(1, 0, 0);
		ellipse.majorAxisEndPoint = new XYZ(2, 0, 0);
		ellipse.radiusRatio = 0.5;

		ellipse.applyRotation(XYZ.axisZ, Math.PI / 2);

		expect(ellipse.center.x).toBeCloseTo(0, 6);
		expect(ellipse.center.y).toBeCloseTo(1, 6);
		expect(ellipse.majorAxisEndPoint.x).toBeCloseTo(0, 6);
		expect(ellipse.majorAxisEndPoint.y).toBeCloseTo(2, 6);
	});

	it('TranslatesHatchBoundaryEdgesAndSeedPoints', () => {
		const line = new HatchBoundaryPathLine();
		line.start = new XY(0, 0);
		line.end = new XY(4, 1);

		const path = new HatchBoundaryPath([line]);
		const hatch = new Hatch();
		hatch.paths.push(path);
		hatch.seedPoints = [new XY(1, 1)];

		hatch.applyTranslation(new XYZ(3, -2, 0));

		const transformed = hatch.paths[0].edges[0] as HatchBoundaryPathLine;
		expect(transformed.start.x).toBeCloseTo(3);
		expect(transformed.start.y).toBeCloseTo(-2);
		expect(transformed.end.x).toBeCloseTo(7);
		expect(transformed.end.y).toBeCloseTo(-1);
		expect(hatch.seedPoints[0].x).toBeCloseTo(4);
		expect(hatch.seedPoints[0].y).toBeCloseTo(-1);
	});

	it('UpdatesHatchPatternGeometryOnTransform', () => {
		const patternLine = new HatchPatternLine();
		patternLine.basePoint = new XY(1, 2);
		patternLine.offset = new XY(0, 1);
		patternLine.dashLengths = [2, -1];

		const pattern = new HatchPattern('TEST');
		pattern.lines.push(patternLine);

		const hatch = new Hatch();
		hatch.pattern = pattern;
		hatch.patternScale = 1;

		hatch.applyScaling(new XYZ(2, 2, 1));

		expect(hatch.patternScale).toBeCloseTo(2);
		expect(patternLine.basePoint.x).toBeCloseTo(2);
		expect(patternLine.basePoint.y).toBeCloseTo(4);
		expect(patternLine.offset.x).toBeCloseTo(0);
		expect(patternLine.offset.y).toBeCloseTo(2);
		expect(patternLine.dashLengths).toEqual([4, -2]);
	});

	it('ReturnsInsertBoundsAndExplodedEntitiesFromBlockTransform', () => {
		const block = new BlockRecord('Test');
		block.entities.add(new Line(new XYZ(0, 0, 0), new XYZ(2, 1, 0)));
		block.entities.add(new Arc(new XYZ(1, 1, 0), 1, 0, Math.PI / 2));

		const insert = new Insert(block);
		insert.insertPoint = new XYZ(5, -1, 0);
		insert.xScale = 2;
		insert.yScale = 3;

		const bounds = insert.getBoundingBox();
		const exploded = Array.from(insert.explode());
		const explodedLine = exploded.find((entity): entity is Line => entity instanceof Line);

		expect(bounds).not.toBeNull();
		expect(bounds?.min.x).toBeCloseTo(5);
		expect(bounds?.min.y).toBeCloseTo(-1);
		expect(bounds?.max.x).toBeCloseTo(9);
		expect(bounds?.max.y).toBeCloseTo(5);
		expect(explodedLine).toBeDefined();
		expect(explodedLine?.startPoint.x).toBeCloseTo(5);
		expect(explodedLine?.startPoint.y).toBeCloseTo(-1);
		expect(explodedLine?.endPoint.x).toBeCloseTo(9);
		expect(explodedLine?.endPoint.y).toBeCloseTo(2);
	});
});