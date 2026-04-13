
import { describe, it, expect } from 'vitest';
import { getDwgFiles, readFileAsArrayBuffer } from '../../testHelpers.js';
import { DwgReader } from '../../../src/IO/DWG/DwgReader.js';
import { ACadVersion } from '../../../src/ACadVersion.js';

const dwgFiles = getDwgFiles();

describe('DwgReaderTests', () => {
  describe.each(dwgFiles.map(f => [f.fileName, f]))('%s', (_name, test) => {
    it('ReadHeader', () => {
      const data = readFileAsArrayBuffer(test.path);
      const reader = new DwgReader(data);
      const header = reader.ReadHeader();
      expect(header).not.toBeNull();
    });

    it('Read', () => {
      const data = readFileAsArrayBuffer(test.path);
      const reader = new DwgReader(data);
      const doc = reader.Read();
      expect(doc).not.toBeNull();
    });

    it('ReadPreview', () => {
      const data = readFileAsArrayBuffer(test.path);
      const reader = new DwgReader(data);
      reader.ReadPreview();
    });

    it('AssertDocumentDefaults', () => {
      const data = readFileAsArrayBuffer(test.path);
      const reader = new DwgReader(data);
      const doc: any = reader.Read();

      expect(doc).not.toBeNull();

      if (doc.header && doc.header.version < ACadVersion.AC1012) {
        return;
      }

      expect(doc.blockRecords).not.toBeNull();
      expect(doc.layers).not.toBeNull();
      expect(doc.lineTypes).not.toBeNull();
    });

    it('AssertDocumentHeader', () => {
      const data = readFileAsArrayBuffer(test.path);
      const reader = new DwgReader(data);
      const doc: any = reader.Read();

      expect(doc).not.toBeNull();
      expect(doc.header).not.toBeNull();
    });

    it('ReadSummaryInfo', () => {
      const data = readFileAsArrayBuffer(test.path);
      const reader = new DwgReader(data);
      reader.ReadSummaryInfo();
    });
  });
});
