import { describe, it, expect, beforeAll } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import { TestVariables } from '../TestVariables.js';
import { DxfWriter } from '../../src/IO/DXF/DxfWriter.js';
import { DxfReader } from '../../src/IO/DXF/DxfReader.js';
import { CadDocument } from '../../src/CadDocument.js';
import { ACadVersion } from '../../src/ACadVersion.js';
import { Line } from '../../src/Entities/Line.js';
import { Circle } from '../../src/Entities/Circle.js';
import { Arc } from '../../src/Entities/Arc.js';
import { Point } from '../../src/Entities/Point.js';
import { LwPolyline, LwPolylineVertex } from '../../src/Entities/LwPolyline.js';
import { MText } from '../../src/Entities/MText.js';
import { XYZ } from '../../src/Math/XYZ.js';
import { XY } from '../../src/Math/XY.js';

class InMemoryAsciiStream {
  private readonly chunks: string[] = [];
  public write(value: string): void { this.chunks.push(value); }
  public flush(): void {}
  public close(): void {}
  public toUint8Array(): Uint8Array {
    return new TextEncoder().encode(this.chunks.join(''));
  }
}

class InMemoryBinaryStream {
  private readonly chunks: Uint8Array[] = [];
  public write(value: Uint8Array): void { this.chunks.push(new Uint8Array(value)); }
  public flush(): void {}
  public close(): void {}
  public toUint8Array(): Uint8Array {
    let total = 0;
    for (const c of this.chunks) total += c.length;
    const merged = new Uint8Array(total);
    let offset = 0;
    for (const c of this.chunks) { merged.set(c, offset); offset += c.length; }
    return merged;
  }
}

const outputDir = path.resolve(TestVariables.outputSamplesFolder, 'sample_output');

function writeDxfAscii(doc: CadDocument, filename: string): string {
  const stream = new InMemoryAsciiStream();
  const writer = new DxfWriter(stream as any, doc, false);
  writer.write();
  const data = stream.toUint8Array();
  const outPath = path.join(outputDir, filename);
  fs.writeFileSync(outPath, data);
  return outPath;
}

function writeDxfBinary(doc: CadDocument, filename: string): string {
  const stream = new InMemoryBinaryStream();
  const writer = new DxfWriter(stream as any, doc, true);
  writer.write();
  const data = stream.toUint8Array();
  const outPath = path.join(outputDir, filename);
  fs.writeFileSync(outPath, data);
  return outPath;
}

describe('SampleOutputTests', () => {
  beforeAll(() => {
    fs.mkdirSync(outputDir, { recursive: true });
  });

  it('Sample_Lines_AC1021_ascii', () => {
    const doc = new CadDocument();
    doc.header.version = ACadVersion.AC1021;

    // Draw a simple rectangle with 4 lines
    const line1 = new Line(new XYZ(0, 0, 0), new XYZ(100, 0, 0));
    const line2 = new Line(new XYZ(100, 0, 0), new XYZ(100, 50, 0));
    const line3 = new Line(new XYZ(100, 50, 0), new XYZ(0, 50, 0));
    const line4 = new Line(new XYZ(0, 50, 0), new XYZ(0, 0, 0));

    // Diagonal lines
    const diag1 = new Line(new XYZ(0, 0, 0), new XYZ(100, 50, 0));
    const diag2 = new Line(new XYZ(100, 0, 0), new XYZ(0, 50, 0));

    for (const e of [line1, line2, line3, line4, diag1, diag2]) {
      doc.entities.add(e);
    }

    const outPath = writeDxfAscii(doc, 'lines_AC1021.dxf');
    expect(fs.existsSync(outPath)).toBe(true);
    expect(fs.statSync(outPath).size).toBeGreaterThan(0);
  });

  it('Sample_Circle_And_Arcs_AC1021_ascii', () => {
    const doc = new CadDocument();
    doc.header.version = ACadVersion.AC1021;

    const circle = new Circle();
    circle.center = new XYZ(50, 50, 0);
    circle.radius = 30;

    const arc1 = new Arc();
    arc1.center = new XYZ(50, 50, 0);
    arc1.radius = 40;
    arc1.startAngle = 0;
    arc1.endAngle = Math.PI / 2;

    const arc2 = new Arc();
    arc2.center = new XYZ(50, 50, 0);
    arc2.radius = 45;
    arc2.startAngle = Math.PI;
    arc2.endAngle = Math.PI * 1.5;

    for (const e of [circle, arc1, arc2]) {
      doc.entities.add(e);
    }

    const outPath = writeDxfAscii(doc, 'circles_arcs_AC1021.dxf');
    expect(fs.existsSync(outPath)).toBe(true);
  });

  it('Sample_Polyline_AC1021_ascii', () => {
    const doc = new CadDocument();
    doc.header.version = ACadVersion.AC1021;

    // Star shape using polyline
    const pts = [
      new XY(50, 100),
      new XY(61, 69),
      new XY(95, 65),
      new XY(68, 43),
      new XY(79, 10),
      new XY(50, 30),
      new XY(21, 10),
      new XY(32, 43),
      new XY(5, 65),
      new XY(39, 69),
    ];

    const poly = new LwPolyline(pts);
    poly.isClosed = true;

    doc.entities.add(poly);

    const outPath = writeDxfAscii(doc, 'polyline_star_AC1021.dxf');
    expect(fs.existsSync(outPath)).toBe(true);
  });

  it('Sample_Mixed_Entities_AC1021_ascii', () => {
    const doc = new CadDocument();
    doc.header.version = ACadVersion.AC1021;

    // Frame
    doc.entities.add(new Line(new XYZ(0, 0, 0), new XYZ(200, 0, 0)));
    doc.entities.add(new Line(new XYZ(200, 0, 0), new XYZ(200, 150, 0)));
    doc.entities.add(new Line(new XYZ(200, 150, 0), new XYZ(0, 150, 0)));
    doc.entities.add(new Line(new XYZ(0, 150, 0), new XYZ(0, 0, 0)));

    // Circle in center
    const c = new Circle();
    c.center = new XYZ(100, 75, 0);
    c.radius = 40;
    doc.entities.add(c);

    // Points at corners
    for (const [x, y] of [[0,0],[200,0],[200,150],[0,150]]) {
      const pt = new Point();
      pt.location = new XYZ(x, y, 0);
      doc.entities.add(pt);
    }

    // Arc
    const arc = new Arc();
    arc.center = new XYZ(100, 75, 0);
    arc.radius = 60;
    arc.startAngle = Math.PI / 4;
    arc.endAngle = (3 * Math.PI) / 4;
    doc.entities.add(arc);

    // MText
    const text = new MText();
    text.insertPoint = new XYZ(10, 140, 0);
    text.value = 'ACadSharp Sample';
    doc.entities.add(text);

    const outPath = writeDxfAscii(doc, 'mixed_entities_AC1021.dxf');
    expect(fs.existsSync(outPath)).toBe(true);
    expect(fs.statSync(outPath).size).toBeGreaterThan(100);
  });

  it('Sample_Mixed_Entities_AC1021_binary', () => {
    const doc = new CadDocument();
    doc.header.version = ACadVersion.AC1021;

    doc.entities.add(new Line(new XYZ(0, 0, 0), new XYZ(100, 0, 0)));
    doc.entities.add(new Line(new XYZ(100, 0, 0), new XYZ(100, 100, 0)));
    doc.entities.add(new Line(new XYZ(100, 100, 0), new XYZ(0, 100, 0)));
    doc.entities.add(new Line(new XYZ(0, 100, 0), new XYZ(0, 0, 0)));

    const c = new Circle();
    c.center = new XYZ(50, 50, 0);
    c.radius = 25;
    doc.entities.add(c);

    const outPath = writeDxfBinary(doc, 'mixed_entities_AC1021.bin.dxf');
    expect(fs.existsSync(outPath)).toBe(true);
  });

  it('Sample_Multiple_Versions_ascii', () => {
    const versions = [ACadVersion.AC1015, ACadVersion.AC1018, ACadVersion.AC1024, ACadVersion.AC1032];

    for (const version of versions) {
      const doc = new CadDocument();
      doc.header.version = version;

      doc.entities.add(new Line(new XYZ(0, 0, 0), new XYZ(100, 100, 0)));

      const c = new Circle();
      c.center = new XYZ(50, 50, 0);
      c.radius = 20;
      doc.entities.add(c);

      const vname = ACadVersion[version];
      const outPath = writeDxfAscii(doc, `sample_${vname}_ascii.dxf`);
      expect(fs.existsSync(outPath)).toBe(true);
    }
  });
});
