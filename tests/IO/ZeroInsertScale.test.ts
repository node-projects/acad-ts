import { expect, it } from 'vitest';
import { CadDocument } from '../../src/CadDocument.js';
import { ACadVersion } from '../../src/ACadVersion.js';
import { Insert } from '../../src/Entities/Insert.js';
import { Line } from '../../src/Entities/Line.js';
import { MText } from '../../src/Entities/MText.js';
import { BackgroundFillFlags } from '../../src/Entities/BackgroundFillFlags.js';
import { BlockRecord } from '../../src/Tables/BlockRecord.js';
import { DwgWriter } from '../../src/IO/DWG/DwgWriter.js';
import { DwgReader } from '../../src/IO/DWG/DwgReader.js';
import { DxfWriter } from '../../src/IO/DXF/DxfWriter.js';
import { DxfReader } from '../../src/IO/DXF/DxfReader.js';

function readDwg(bytes: Uint8Array): CadDocument {
  return DwgReader.readFromStream(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
}

it.each([false, true])('preserves zero INSERT scales in DXF (binary=%s)', binary => {
  const document = new CadDocument(ACadVersion.AC1032);
  const block = new BlockRecord('zero-scale');
  block.entities.add(new Line());
  const insert = new Insert(block);
  insert.xScale = 0;
  insert.yScale = 0;
  insert.zScale = -2;
  document.entities.add(insert);
  const chunks: Uint8Array[] = [];
  DxfWriter.writeToStream({ write(value: string | Uint8Array) {
    chunks.push(typeof value === 'string' ? new TextEncoder().encode(value) : value);
  } }, document, binary);
  const data = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) { data.set(chunk, offset); offset += chunk.length; }
  const restored = [...DxfReader.readFromStream(data).entities][0] as Insert;
  expect([restored.xScale, restored.yScale, restored.zScale]).toEqual([0, 0, -2]);
});

it.each([ACadVersion.AC1014, ACadVersion.AC1015, ACadVersion.AC1021, ACadVersion.AC1032])('normalizes zero DWG scales only for R2000+ without changing the source in %s', version => {
  const document = new CadDocument(version);
  const block = new BlockRecord('zero-scale');
  block.entities.add(new Line());
  const scales = [[0, 0, 0], [0, 2, 3], [2, 0, 3], [-2, 3, 0]];
  for (const [x, y, z] of scales) {
    const insert = new Insert(block);
    insert.xScale = x; insert.yScale = y; insert.zScale = z;
    document.entities.add(insert);
  }
  const restored = [...readDwg(DwgWriter.writeToBuffer(document)).entities] as Insert[];
  expect(restored.map(insert => [insert.xScale, insert.yScale, insert.zScale]))
    .toEqual(scales.map(values => values.map(value => version >= ACadVersion.AC1015 && value === 0 ? 1 : value)));
  expect([...document.entities].map(entity => [(entity as Insert).xScale, (entity as Insert).yScale, (entity as Insert).zScale])).toEqual(scales);
});

it.each([50, 100, 12345])('ignores invalid MTEXT background transparency %s without losing the entity', transparency => {
  const document = new CadDocument(ACadVersion.AC1024);
  const text = new MText();
  text.value = 'background';
  text.backgroundFillFlags = BackgroundFillFlags.UseBackgroundFillColor;
  text.backgroundTransparency = transparency;
  document.entities.add(text);
  const restored = [...readDwg(DwgWriter.writeToBuffer(document)).entities][0] as MText;
  expect(restored.value).toBe(text.value);
  expect(restored.backgroundTransparency).toBe(transparency <= 90 ? transparency : 0);
});
