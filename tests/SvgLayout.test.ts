import { describe, expect, it } from 'vitest';
import { Line } from '../src/Entities/Line.js';
import { XYZ } from '../src/Math/XYZ.js';
import { SvgConfiguration } from '../src/IO/SVG/SvgConfiguration.js';
import { SvgDocumentBuilder } from '../src/IO/SVG/SvgDocumentBuilder.js';
import { SvgXmlWriter } from '../src/IO/SVG/SvgXmlWriter.js';
import { BlockRecord } from '../src/Tables/BlockRecord.js';

describe('SvgLayoutTests', () => {
	it('WritesLayoutsWithSvgXmlWriter', () => {
		const record = BlockRecord.paperSpace;
		const layout = record.layout!;
		const line = new Line(new XYZ(0, 0, 0), new XYZ(10, 5, 0));
		const writer = new SvgXmlWriter(new Uint8Array(4096), new SvgConfiguration());

		record.entities.add(line);

		expect(() => writer.writeLayout(layout)).not.toThrow();
		expect(writer.getOutput()).toContain('<svg');
		expect(writer.getOutput()).toContain('<line');
	});

	it('WritesLayoutsWithSvgDocumentBuilder', () => {
		const record = BlockRecord.paperSpace;
		const layout = record.layout!;
		const line = new Line(new XYZ(1, 2, 0), new XYZ(6, 4, 0));
		const writer = new SvgDocumentBuilder(new Uint8Array(4096), null, new SvgConfiguration());

		record.entities.add(line);

		expect(() => writer.writeLayout(layout)).not.toThrow();
		expect(writer.getOutput()).toContain('<svg');
		expect(writer.getOutput()).toContain('<line');
	});
});