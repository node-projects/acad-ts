import { expect, it } from 'vitest';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { CadDocument } from '../../../src/CadDocument.js';
import { DwgReader } from '../../../src/IO/DWG/DwgReader.js';
import { DwgFileHeaderAC15 } from '../../../src/IO/DWG/FileHeaders/DwgFileHeaderAC15.js';
import { DwgFileHeaderAC21 } from '../../../src/IO/DWG/FileHeaders/DwgFileHeaderAC21.js';
import { DwgStreamReaderBase } from '../../../src/IO/DWG/DwgStreamReaders/DwgStreamReaderBase.js';
import '../../../src/IO/DWG/DwgStreamReaders/DwgStreamReaderFactory.js';

it.each([ACadVersion.AC1012, ACadVersion.AC1015, ACadVersion.AC1021])('reads Template MEASUREMENT after a versioned description in %s', version => {
  const bytes = new Uint8Array(version >= ACadVersion.AC1021 ? [2, 0, 65, 0, 66, 0, 1, 0] : [2, 0, 65, 66, 1, 0]);
  const header = version >= ACadVersion.AC1021 ? new DwgFileHeaderAC21(version) : new DwgFileHeaderAC15(version);
  if (header instanceof DwgFileHeaderAC15) header.records.set(4, { size: bytes.length } as never);
  const reader = new DwgReader(new ArrayBuffer(0));
  const document = new CadDocument();
  Reflect.set(reader, '_fileHeader', header);
  Reflect.set(reader, '_document', document);
  Reflect.set(reader, '_getSectionStream', () => DwgStreamReaderBase.getStreamHandler(version, bytes));
  Reflect.apply(Reflect.get(reader, '_readTemplate'), reader, []);
  expect(document.header.measurementUnits).toBe(1);
});
