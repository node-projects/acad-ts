import { expect, it } from 'vitest';
import { GraphicsType, ProxyRawGeometry, ProxyXLine } from '../src/Entities/ProxyGraphics.js';
import { ProxyGeometryWriter } from '../src/IO/ProxyGeometryWriter.js';
import { ProxyGeometryReader } from '../src/IO/ProxyGeometryReader.js';

it('continues at the declared proxy record end after an incomplete primitive', () => {
  const bad = new ProxyRawGeometry(GraphicsType.Circle, new Uint8Array([1, 2, 3, 4]));
  const next = new ProxyXLine(); next.point2.x = 25;
  const data = ProxyGeometryWriter.writeGeometries([bad, next]);
  expect(new DataView(data.buffer, data.byteOffset).getUint32(0, true)).toBe(data.length);
  expect(ProxyGeometryReader.readGeometries(data)).toEqual([bad, next]);
});
