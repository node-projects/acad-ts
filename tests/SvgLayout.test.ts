import { describe, expect, it } from 'vitest';
import { Line } from '../src/Entities/Line.js';
import { XYZ } from '../src/Math/XYZ.js';
import { SvgConfiguration } from '../src/IO/SVG/SvgConfiguration.js';
import { SvgDocumentBuilder } from '../src/IO/SVG/SvgDocumentBuilder.js';
import { SvgXmlWriter } from '../src/IO/SVG/SvgXmlWriter.js';
import { BlockRecord } from '../src/Tables/BlockRecord.js';
import { Leader, LeaderPathType } from '../src/Entities/Leader.js';
import { Color } from '../src/Color.js';

describe('SvgLayoutTests', () => {
  it.each([LeaderPathType.StraightLineSegments, LeaderPathType.Spline])('renders leader paths and arrowheads for path type %s', pathType => {
    const record = BlockRecord.modelSpace;
    const leader = new Leader();
    leader.vertices = [new XYZ(1, 2), new XYZ(6, 8), new XYZ(12, 8)];
    leader.pathType = pathType; leader.arrowHeadEnabled = true; leader.color = Color.red;
    record.entities.add(leader);
    const writer = new SvgXmlWriter(new ArrayBuffer(0), new SvgConfiguration());
    const warnings: string[] = [];
    writer.onNotification = (_sender, event) => warnings.push(event.message);
    writer.writeBlock(record);
    expect(warnings).toEqual([]);
    expect(writer.getOutput()).toContain('<polyline');
    expect(writer.getOutput()).toContain('<polygon');
    expect(writer.getOutput()).toContain('rgb(255,0,0)');
    expect(writer.getOutput()).not.toMatch(/NaN|Infinity/);
  });
	it('WritesLayoutsWithSvgXmlWriter', () => {
		const record = BlockRecord.paperSpace;
		const layout = record.layout!;
		const line = new Line(new XYZ(0, 0, 0), new XYZ(10, 5, 0));
		const writer = new SvgXmlWriter(new Uint8Array(4096), new SvgConfiguration());

		record.entities.add(line);

		expect(() => writer.writeLayout(layout)).not.toThrow();
		expect(writer.getOutput()).toContain('<svg');
		expect(writer.getOutput()).toContain('<line');
		expect(writer.getOutput()).toContain('</svg>');
		expect(writer.getOutput()).not.toContain('</>');
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
