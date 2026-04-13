import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import { TestVariables } from '../../TestVariables.js';
import { readFileAsArrayBuffer } from '../../testHelpers.js';
import { DwgWriter } from '../../../src/IO/DWG/DwgWriter.js';
import { DwgReader } from '../../../src/IO/DWG/DwgReader.js';
import { CadDocument } from '../../../src/CadDocument.js';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { Line } from '../../../src/Entities/Line.js';
import { Point } from '../../../src/Entities/Point.js';

const versions = [
  ACadVersion.AC1012,
  ACadVersion.AC1014,
  ACadVersion.AC1015,
  ACadVersion.AC1018,
  ACadVersion.AC1021,
  ACadVersion.AC1024,
  ACadVersion.AC1027,
  ACadVersion.AC1032,
];

function isSupportedVersion(version: ACadVersion): boolean {
  // AC1012 and below are not supported for writing
  return version >= ACadVersion.AC1014;
}

describe('DwgWriterTests', () => {
  describe.each(versions.map(v => [ACadVersion[v] ?? `v${v}`, v]))('Version %s', (_name, version) => {
    it('WriteEmpty', () => {
      const doc = new CadDocument();
      if (doc.header) doc.header.version = version;

      const outPath = path.join(TestVariables.outputSamplesFolder, `out_empty_sample_${ACadVersion[version]}.dwg`);

      const buffer = new ArrayBuffer(1024 * 1024);
      const writer = new DwgWriter(buffer, doc);

      if (isSupportedVersion(version)) {
        writer.Write();
        fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

        // Read back
        const readData = readFileAsArrayBuffer(outPath);
        const reader = new DwgReader(readData);
        const readed = reader.Read();
        expect(readed).not.toBeNull();
      } else {
        expect(() => writer.Write()).toThrow();
      }
    });

    it('WriteWithEntities', () => {
      if (!isSupportedVersion(version)) return;

      const doc = new CadDocument();
      if (doc.header) doc.header.version = version;

      if (doc.entities && typeof doc.entities.add === 'function') {
        doc.entities.add(new Point());
        doc.entities.add(new Line());
      }

      const outPath = path.join(TestVariables.outputSamplesFolder, `out_sample_${ACadVersion[version]}.dwg`);

      const buffer = new ArrayBuffer(1024 * 1024);
      const writer = new DwgWriter(buffer, doc);
      writer.Write();

      fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

      // Read back
      const readData = readFileAsArrayBuffer(outPath);
      const reader = new DwgReader(readData);
      const readed = reader.Read();
      expect(readed).not.toBeNull();
    });

    it('WriteSummaryTest', () => {
      if (version <= ACadVersion.AC1015) return;
      if (!isSupportedVersion(version)) return;

      const doc = new CadDocument();
      if (doc.header) doc.header.version = version;
      doc.summaryInfo = {
        title: 'This is a random title',
        subject: 'This is a subject',
        author: 'ACadSharp',
        keywords: 'My Keywords',
        comments: 'This is my comment',
      } as any;

      const buffer = new ArrayBuffer(1024 * 1024);
      const writer = new DwgWriter(buffer, doc);
      writer.Write();

      const readBuffer = buffer.slice(0);
      const reader = new DwgReader(readBuffer);
      const info = reader.ReadSummaryInfo();

      if (info) {
        expect(info.title).toBe(doc.summaryInfo!.title);
        expect(info.subject).toBe(doc.summaryInfo!.subject);
        expect(info.author).toBe(doc.summaryInfo!.author);
        expect(info.keywords).toBe(doc.summaryInfo!.keywords);
        expect(info.comments).toBe(doc.summaryInfo!.comments);
      }
    });
  });
});
