import { expect, it } from 'vitest';
import { CadDocument } from '../../src/CadDocument.js';
import { Ellipse } from '../../src/Entities/Ellipse.js';
import { DxfReader } from '../../src/IO/DXF/DxfReader.js';
import { DxfWriter } from '../../src/IO/DXF/DxfWriter.js';
import { DwgReader } from '../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../src/IO/DWG/DwgWriter.js';
import { MathHelper } from '../../src/Math/MathHelper.js';

it.each([0, -0.01, 0.5, 1 + 1e-14])('clamps file ellipse ratios in both readers (%s)', ratio => {
  const doc = new CadDocument(), ellipse = new Ellipse();
  Reflect.set(ellipse, '_radiusRatio', ratio); doc.entities.add(ellipse);
  const chunks: string[] = [];
  new DxfWriter({ write: (value: string) => chunks.push(value), flush() {}, close() {} }, doc, false).write();
  const dxf = new DxfReader(new TextEncoder().encode(chunks.join(''))).read();
  const buffer = new ArrayBuffer(1024 * 1024), writer = new DwgWriter(buffer, doc); writer.write();
  const dwg = new DwgReader(buffer.slice(0, writer.bytesWritten)).read();
  for (const result of [dxf, dwg]) {
    expect(([...result.entities][0] as Ellipse).radiusRatio).toBe(ratio <= 0 ? MathHelper.epsilon : Math.min(ratio, 1));
  }
  expect(() => { ellipse.radiusRatio = 1.01; }).toThrow();
  expect(() => { ellipse.radiusRatio = 0; }).toThrow();
});
