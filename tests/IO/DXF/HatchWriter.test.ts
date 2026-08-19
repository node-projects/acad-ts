import { describe, expect, it } from 'vitest';
import { CadDocument } from '../../../src/CadDocument.js';
import { BoundaryPathFlags } from '../../../src/Entities/BoundaryPathFlags.js';
import { Hatch, HatchBoundaryPath, HatchBoundaryPathPolyline } from '../../../src/Entities/Hatch.js';
import { DxfReader } from '../../../src/IO/DXF/DxfReader.js';
import { DxfWriter } from '../../../src/IO/DXF/DxfWriter.js';
import { XY } from '../../../src/Math/XY.js';
import { XYZ } from '../../../src/Math/XYZ.js';

interface DxfPair {
  code: number;
  value: string;
}

class InMemoryAsciiStream {
  private readonly chunks: string[] = [];

  public write(value: string): void {
    this.chunks.push(value);
  }

  public flush(): void {}

  public close(): void {}

  public toString(): string {
    return this.chunks.join('');
  }
}

function writeHatch(pixelSize: number = 0, seedPoints: XY[] = []): { data: Uint8Array; pairs: DxfPair[] } {
  const boundary = new HatchBoundaryPathPolyline();
  boundary.isClosed = true;
  boundary.vertices = [
    new XYZ(0, 0, 0),
    new XYZ(10, 0, 0),
    new XYZ(10, 10, 0),
    new XYZ(0, 10, 0),
  ];

  const path = new HatchBoundaryPath([boundary]);
  path.flags = BoundaryPathFlags.External | BoundaryPathFlags.Outermost;

  const hatch = new Hatch();
  hatch.elevation = 4;
  hatch.isSolid = true;
  hatch.paths = [path];
  hatch.pixelSize = pixelSize;
  hatch.seedPoints = seedPoints;

  const document = new CadDocument();
  document.entities.add(hatch);

  const output = new InMemoryAsciiStream();
  new DxfWriter(output, document, false).write();

  const data = new TextEncoder().encode(output.toString());
  const lines = output.toString().trimEnd().split(/\r?\n/);
  const pairs: DxfPair[] = [];
  for (let index = 0; index < lines.length; index += 2) {
    pairs.push({ code: Number(lines[index].trim()), value: lines[index + 1] });
  }

  const start = pairs.findIndex(pair => pair.code === 100 && pair.value === 'AcDbHatch');
  const end = pairs.findIndex((pair, index) => index > start && pair.code === 0);
  return { data, pairs: pairs.slice(start, end) };
}

describe('DXF HATCH writer', () => {
  it('writes the complete elevation point and omits a default pixel size', () => {
    const { pairs } = writeHatch();

    expect(pairs.slice(0, 5).map(pair => pair.code)).toEqual([100, 10, 20, 30, 210]);
    expect(pairs.slice(1, 4).map(pair => Number(pair.value))).toEqual([0, 0, 4]);
    expect(pairs.some(pair => pair.code === 47)).toBe(false);
    expect(pairs.some(pair => pair.code === 98 && Number(pair.value) === 0)).toBe(true);
  });

  it('writes an explicitly configured pixel size', () => {
    const { pairs } = writeHatch(0.25);

    expect(pairs.some(pair => pair.code === 47 && Number(pair.value) === 0.25)).toBe(true);
  });

  it('roundtrips seed points separately from the elevation point', () => {
    const { data } = writeHatch(0, [new XY(2, 3), new XY(4, 5)]);

    const document = new DxfReader(data).read();
    const hatch = [...document.entities].find(entity => entity instanceof Hatch) as Hatch;

    expect(hatch.elevation).toBe(4);
    expect(hatch.seedPoints).toEqual([new XY(2, 3), new XY(4, 5)]);
  });
});
