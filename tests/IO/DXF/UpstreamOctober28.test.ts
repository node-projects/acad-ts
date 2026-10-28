import { expect, it } from 'vitest';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { CadDocument } from '../../../src/CadDocument.js';
import { Color } from '../../../src/Color.js';
import { Hatch, HatchBoundaryPath } from '../../../src/Entities/Hatch.js';
import { BoundaryPathFlags } from '../../../src/Entities/BoundaryPathFlags.js';
import { HatchPatternLine } from '../../../src/Entities/HatchPattern.js';
import { GradientColor } from '../../../src/Entities/GradientColor.js';
import { DxfWriter } from '../../../src/IO/DXF/DxfWriter.js';
import { DxfReader } from '../../../src/IO/DXF/DxfReader.js';
import { DxfTextReader } from '../../../src/IO/DXF/DxfStreamReader/DxfTextReader.js';
import { Region } from '../../../src/Entities/Region.js';
import { Solid } from '../../../src/Entities/Solid.js';
import { XYZ } from '../../../src/Math/XYZ.js';

it.each([false, true])('reads planar SOLID geometry through its own subclass (binary=%s)', binary => {
  const document = new CadDocument(ACadVersion.AC1032);
  const solid = new Solid(new XYZ(1, 2, 3), new XYZ(4, 5, 6), new XYZ(7, 8, 9), new XYZ(10, 11, 12));
  solid.thickness = 2;
  document.entities.add(solid);
  const restored = [...DxfReader.readFromStream(write(document, binary)).entities][0] as Solid;
  expect(restored.firstCorner).toEqual(solid.firstCorner);
  expect(restored.fourthCorner).toEqual(solid.fourthCorner);
  expect(restored.thickness).toBe(2);
});

it('warns and writes safely when pre-R2013 modeler SAT is absent', () => {
  const document = new CadDocument(ACadVersion.AC1024);
  document.entities.add(new Region());
  const notifications: string[] = [];
  const writer = new DxfWriter({ write(_value: string) {} }, document);
  writer.onNotification = (_sender, event) => notifications.push(event.message);
  expect(() => writer.write()).not.toThrow();
  expect(notifications.some(message => message.startsWith('Encrypted SAT not found for REGION:'))).toBe(true);
});

function write(document: CadDocument, binary = false): Uint8Array {
  const chunks: Uint8Array[] = [];
  DxfWriter.writeToStream({ write(value: string | Uint8Array) {
    chunks.push(typeof value === 'string' ? new TextEncoder().encode(value) : value);
  } }, document, binary);
  const bytes = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes;
}

function entityPairs(bytes: Uint8Array, name: string): [number, unknown][] {
  const reader = new DxfTextReader(bytes);
  expect(reader.find(name)).toBe(true);
  const pairs: [number, unknown][] = [];
  reader.readNext();
  while (reader.code !== 0) { pairs.push([reader.code, reader.value]); reader.readNext(); }
  return pairs;
}

it.each([false, true])('round-trips indexed and true-color hatch gradients (binary=%s)', binary => {
  const document = new CadDocument(ACadVersion.AC1032);
  const hatch = new Hatch();
  hatch.isSolid = true;
  Object.assign(hatch.gradientColor, { enabled: true, name: 'LINEAR', angle: 0.5, shift: 0.25, colorTint: 0.75 });
  hatch.gradientColor.colors = [
    Object.assign(new GradientColor(), { value: 0, color: new Color(1) }),
    Object.assign(new GradientColor(), { value: 1, color: new Color(10, 20, 30) }),
  ];
  document.entities.add(hatch);
  const bytes = write(document, binary);
  if (!binary) {
    const pairs = entityPairs(bytes, 'HATCH');
    expect(pairs.filter(([code]) => code === 421)).toEqual([[421, 0x0a141e]]);
    expect(pairs.filter(([code]) => code === 63).map(([, value]) => value)).toEqual([1, hatch.gradientColor.colors[1].color.getApproxIndex()]);
    expect(pairs.findIndex(([code]) => code === 460)).toBeLessThan(pairs.findIndex(([code]) => code === 453));
  }
  const restored = [...DxfReader.readFromStream(bytes).entities][0] as Hatch;
  expect(restored.gradientColor.name).toBe('LINEAR');
  expect(restored.gradientColor.angle).toBe(0.5);
  expect(restored.gradientColor.colors.map(color => color.color)).toEqual(hatch.gradientColor.colors.map(color => color.color));
});

it.each([ACadVersion.AC1015, ACadVersion.AC1018])('filters hatch gradient metadata by DXF version %s and pattern lines', version => {
  const document = new CadDocument(version);
  const hatch = new Hatch();
  hatch.gradientColor.enabled = true;
  document.entities.add(hatch);
  expect(entityPairs(write(document), 'HATCH').some(([code]) => code === 450)).toBe(version > ACadVersion.AC1015);
  hatch.pattern.lines.push(new HatchPatternLine());
  expect(entityPairs(write(document), 'HATCH').some(([code]) => code === 450)).toBe(false);
});

it('writes disabled gradient metadata and a zero pixel size for derived boundaries', () => {
  const document = new CadDocument(ACadVersion.AC1018);
  const hatch = new Hatch();
  const path = new HatchBoundaryPath();
  path.flags |= BoundaryPathFlags.Derived;
  hatch.paths.push(path);
  document.entities.add(hatch);
  const pairs = entityPairs(write(document), 'HATCH');
  expect(pairs).toContainEqual([450, 0]);
  expect(pairs).toContainEqual([47, 0]);
});

it('writes an empty hatch gradient name when input metadata has no name', () => {
  const document = new CadDocument(ACadVersion.AC1018);
  const hatch = new Hatch();
  Object.assign(hatch.gradientColor, { name: null });
  document.entities.add(hatch);
  expect(entityPairs(write(document), 'HATCH')).toContainEqual([470, '']);
});
