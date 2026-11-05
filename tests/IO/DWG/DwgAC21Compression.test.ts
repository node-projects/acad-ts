import { expect, it } from 'vitest';
import { DwgLZ77AC21Compressor } from '../../../src/IO/DWG/DwgStreamWriters/DwgLZ77AC21Compressor.js';
import { DwgLZ77AC21Decompressor } from '../../../src/IO/DWG/DwgStreamReaders/DwgLZ77AC21Decompressor.js';

const compressor = new DwgLZ77AC21Compressor();
function roundtrip(data: Uint8Array): number {
  const compressed: number[] = [99, 88];
  const source = new Uint8Array(data.length + 2); source.set(data, 1);
  compressor.compress(source, 1, data.length, compressed);
  const bytes = Uint8Array.from(compressed), output = new Uint8Array(data.length);
  if (data.length) DwgLZ77AC21Decompressor.decompress(bytes, 2, bytes.length - 2, output);
  expect(output).toEqual(data);
  expect(bytes.slice(0, 2)).toEqual(new Uint8Array([99, 88]));
  return bytes.length - 2;
}

it('round-trips literal tail permutations and extended literal lengths', () => {
  for (const size of [...Array.from({ length: 100 }, (_, i) => i), 255, 277, 278, 65535, 65813]) {
    let seed = 123456;
    roundtrip(Uint8Array.from({ length: size }, () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed >>> 24; }));
  }
});

it('compresses overlapping runs, long matches and repeated patterns', () => {
  for (const size of [3, 19, 50, 255, 256, 65791, 131590]) {
    const data = Uint8Array.from({ length: size }, (_, i) => i % 13);
    const compressedSize = roundtrip(data);
    if (size > 100) expect(compressedSize).toBeLessThan(size / 2);
  }
});

it('rejects invalid source ranges', () => {
  expect(() => compressor.compress(new Uint8Array(3), -1, 3, [])).toThrow(RangeError);
  expect(() => compressor.compress(new Uint8Array(3), 1, 3, [])).toThrow(RangeError);
});

it('round-trips match opcode length/distance boundaries and literal continuations', () => {
  for (const distance of [1, 13, 512, 513, 4096, 4097, 8192, 8193, 65535]) {
    for (const length of [3, 15, 18, 19, 34, 50, 51, 255, 256, 65791]) {
      let seed = 98765;
      const data = Uint8Array.from({ length: distance + length + 3 }, () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed >>> 24;
      });
      for (let i = distance; i < distance + length; i++) data[i] = data[i - distance];
      roundtrip(data);
    }
  }
});
