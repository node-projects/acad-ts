import { describe, expect, it } from 'vitest';
import { ACadVersion } from '../src/ACadVersion.js';
import { Hatch, HatchBoundaryPath, HatchBoundaryPathPolyline } from '../src/Entities/Hatch.js';
import { HatchPattern, HatchPatternLine } from '../src/Entities/HatchPattern.js';
import { Insert } from '../src/Entities/Insert.js';
import { INamedCadObjectExtensions } from '../src/Extensions/INamedCadObjectExtensions.js';
import { CadFileFormat } from '../src/IO/CadFileFormat.js';
import { XY } from '../src/Math/XY.js';
import { XYZ } from '../src/Math/XYZ.js';
import { Layer } from '../src/Tables/Layer.js';

describe('upstream synchronization features', () => {
	it('explodes a clipped hatch line into continuous line entities', () => {
		const hatch = new Hatch();
		const boundary = new HatchBoundaryPathPolyline();
		boundary.isClosed = true;
		boundary.vertices = [new XYZ(0, 0), new XYZ(10, 0), new XYZ(10, 10), new XYZ(0, 10)];
		hatch.paths = [new HatchBoundaryPath([boundary])];
		const pattern = new HatchPattern('TEST');
		const patternLine = new HatchPatternLine();
		patternLine.basePoint = new XY(0, 5);
		patternLine.offset = new XY(0, 20);
		pattern.lines.push(patternLine);
		hatch.pattern = pattern;

		const lines = hatch.explodePattern();
		expect(lines).toHaveLength(1);
		expect(lines[0].getBoundingBox()).toMatchObject({
			min: { x: 0, y: 5, z: 0 },
			max: { x: 10, y: 5, z: 0 },
		});
	});

	it('validates objects for the selected CAD format and version', () => {
		const insert = new Insert();
		expect(insert.isValid(CadFileFormat.DXF, ACadVersion.AC1032)).toBe(false);
		insert.normal = XYZ.zero;
		expect(insert.validate(CadFileFormat.DWG, ACadVersion.AC1032)).toContain('normal vector cannot be zero.');
	});

	it('applies the AutoCAD leading-asterisk name rule', () => {
		expect(INamedCadObjectExtensions.isValidDxfName(new Layer('*anonymous'))).toBe(true);
		expect(INamedCadObjectExtensions.isValidDxfName(new Layer('bad*name'))).toBe(false);
	});
});
