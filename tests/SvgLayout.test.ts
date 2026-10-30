import { describe, expect, it } from 'vitest';
import { Line } from '../src/Entities/Line.js';
import { XYZ } from '../src/Math/XYZ.js';
import { SvgConfiguration } from '../src/IO/SVG/SvgConfiguration.js';
import { SvgDocumentBuilder } from '../src/IO/SVG/SvgDocumentBuilder.js';
import { SvgXmlWriter } from '../src/IO/SVG/SvgXmlWriter.js';
import { BlockRecord } from '../src/Tables/BlockRecord.js';
import { Leader, LeaderPathType } from '../src/Entities/Leader.js';
import { Color } from '../src/Color.js';
import { Arc } from '../src/Entities/Arc.js';
import { Circle } from '../src/Entities/Circle.js';
import { MText } from '../src/Entities/MText.js';
import { Layer } from '../src/Tables/Layer.js';

describe('SvgLayoutTests', () => {
  it('projects reversed-normal arcs into world coordinates for rendering and bounds', () => {
    const record = BlockRecord.modelSpace;
    const arc = new Arc(new XYZ(-10, 20), 5, 0, Math.PI / 2); arc.normal = new XYZ(0, 0, -1);
    record.entities.add(arc);
    const writer = new SvgXmlWriter(new ArrayBuffer(0), new SvgConfiguration()); writer.writeBlock(record);
    expect(writer.getOutput()).toContain('matrix(-1,0,0,1,0,0)');
    expect(writer.getOutput()).toMatch(/viewBox="5 20 5 5"/);
    expect(arc.center.x).toBe(-10);
  });

  it('uses the short arc when angles cross zero and excludes invisible geometry from fit bounds', () => {
    const record = BlockRecord.modelSpace;
    record.entities.add(new Arc(new XYZ(), 5, 7 * Math.PI / 4, 0));
    const text = new MText(); text.value = ' '; text.insertPoint = new XYZ(-10000, -10000); record.entities.add(text);
    const hidden = new Line(new XYZ(-1000, -1000), new XYZ(-900, -900)); hidden.layer = new Layer('Off'); hidden.layer.isOn = false; record.entities.add(hidden);
    const writer = new SvgXmlWriter(new ArrayBuffer(0), new SvgConfiguration()); writer.writeBlock(record);
    expect(writer.getOutput()).toMatch(/A 5 5 0 0 1 5,0/);
    expect(writer.getOutput()).not.toContain('<line');
    expect(writer.getOutput()).not.toContain('<text');
    expect(writer.getOutput()).not.toContain('-10000');
  });

  it('projects tilted circles without changing their stored coordinates', () => {
    const record = BlockRecord.modelSpace;
    const circle = new Circle(new XYZ(1, 2, 3), 4); circle.normal = new XYZ(0, 1, 0); record.entities.add(circle);
    const writer = new SvgXmlWriter(new ArrayBuffer(0), new SvgConfiguration()); writer.writeBlock(record);
    expect(writer.getOutput()).toContain('matrix(-1,0,0,0,0,3)');
    expect(writer.getOutput()).not.toMatch(/NaN|Infinity/);
    expect(circle.center).toEqual(new XYZ(1, 2, 3));
  });

  it('adapts ACI 7 to the display background while preserving explicit true colors', () => {
    const record = BlockRecord.modelSpace;
    const adaptive = new Line(new XYZ(), new XYZ(10, 0)); adaptive.color = new Color(7); record.entities.add(adaptive);
    const explicit = new Line(new XYZ(0, 1), new XYZ(10, 1)); explicit.color = new Color(255, 255, 255); record.entities.add(explicit);
    for (const [background, expected] of [[new Color(255, 255, 255), 'rgb(0,0,0)'], [new Color(32, 32, 32), 'rgb(255,255,255)']] as const) {
      const config = new SvgConfiguration(); config.backgroundColor = background;
      const writer = new SvgXmlWriter(new ArrayBuffer(0), config); writer.writeBlock(record);
      const strokes = [...writer.getOutput().matchAll(/stroke="([^"]+)"/g)].map(match => match[1]);
      expect(strokes).toEqual([expected, 'rgb(255,255,255)']);
    }
  });
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
