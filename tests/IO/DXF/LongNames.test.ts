import { expect, it } from 'vitest';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { INamedCadObjectExtensions } from '../../../src/Extensions/INamedCadObjectExtensions.js';
import { CadDocument } from '../../../src/CadDocument.js';
import { Layer } from '../../../src/Tables/Layer.js';
import { Line } from '../../../src/Entities/Line.js';
import { DxfReader } from '../../../src/IO/DXF/DxfReader.js';
import { DxfWriter } from '../../../src/IO/DXF/DxfWriter.js';

it('retains long R2000 table names while preserving earlier and 255-character limits', () => {
  const name = 'Layer_'.repeat(10), layer = new Layer(name);
  expect(INamedCadObjectExtensions.isValidDxfName(layer, ACadVersion.AC1014)).toBe(false);
  expect(INamedCadObjectExtensions.isValidDxfName(layer, ACadVersion.AC1015)).toBe(true);
  expect(INamedCadObjectExtensions.isValidDxfName(new Layer('a'.repeat(256)))).toBe(false);
  const doc = new CadDocument(ACadVersion.AC1015), line = new Line(); line.layer = layer; doc.entities.add(line);
  const chunks: string[] = [];
  new DxfWriter({ write: (value: string) => chunks.push(value), flush() {}, close() {} }, doc, false).write();
  const decoded = new DxfReader(new TextEncoder().encode(chunks.join(''))).read();
  expect(decoded.layers.get(name).name).toBe(name);
  expect([...decoded.entities][0].layer.name).toBe(name);
});
