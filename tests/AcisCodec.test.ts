import { expect, it } from 'vitest';
import { AcisTextCodec } from '../src/IO/AcisTextCodec.js';
import { AcisEncryption } from '../src/IO/AcisEncryption.js';
it('exposes byte-based encoding and trims at the earliest text or binary terminator', () => {
  const bytes = Uint8Array.from({length:256},(_,i)=>i);
  expect(AcisEncryption.decode(AcisEncryption.encode(bytes))).toEqual(bytes);
  const text = '700 0 0 0\nEnd-of-ACIS-data'; expect(AcisEncryption.decode(AcisEncryption.encode(text))).toBe(text); expect(AcisEncryption.decode(text)).toBe(text);
  const marker = Uint8Array.from([14,3,69,110,100,14,2,111,102,14,3,65,83,77,13,4,100,97,116,97]);
  const data = new Uint8Array([...marker,...new TextEncoder().encode('End-of-ACIS-data')]);
  expect(AcisEncryption.trimAtAcisEnd(data)).toEqual(marker);
  expect(AcisEncryption.isBinary(new TextEncoder().encode('ASM BinaryFile'))).toBe(true);
});
it('mirrors only printable ASCII and preserves all control and extended byte values', () => {
  const bytes = Uint8Array.from({length:256},(_,i)=>i), encoded = AcisTextCodec.decode(bytes);
  expect(AcisTextCodec.decode(encoded)).toEqual(bytes);
  for (let i=0;i<256;i++) expect(encoded[i]).toBe(i>32 && i<127 ? 159-i : i);
  const text = String.fromCharCode(...bytes) + '中文';
  expect(AcisTextCodec.decode(AcisTextCodec.decode(text))).toBe(text);
});
