import { expect, it } from 'vitest';
import { AcisTextCodec } from '../src/IO/AcisTextCodec.js';
it('mirrors only printable ASCII and preserves all control and extended byte values', () => {
  const bytes = Uint8Array.from({length:256},(_,i)=>i), encoded = AcisTextCodec.decode(bytes);
  expect(AcisTextCodec.decode(encoded)).toEqual(bytes);
  for (let i=0;i<256;i++) expect(encoded[i]).toBe(i>32 && i<127 ? 159-i : i);
  const text = String.fromCharCode(...bytes) + '中文';
  expect(AcisTextCodec.decode(AcisTextCodec.decode(text))).toBe(text);
});
