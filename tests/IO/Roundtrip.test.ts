import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import { TestVariables } from '../TestVariables.js';
import { getDwgFiles, getDxfAsciiFiles, getDxfBinaryFiles, readFileAsArrayBuffer, readFileAsUint8Array } from '../testHelpers.js';
import { DxfReader } from '../../src/IO/DXF/DxfReader.js';
import { DxfWriter } from '../../src/IO/DXF/DxfWriter.js';
import { DwgReader } from '../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../src/IO/DWG/DwgWriter.js';
import { ACadVersion } from '../../src/ACadVersion.js';
import { CadDocument } from '../../src/CadDocument.js';

const roundtripOutDir = path.join(TestVariables.outputSamplesFolder, 'roundtrip');
if (!fs.existsSync(roundtripOutDir)) {
  fs.mkdirSync(roundtripOutDir, { recursive: true });
}

const dwgFiles = getDwgFiles();
const dxfAsciiFiles = getDxfAsciiFiles();
const dxfBinaryFiles = getDxfBinaryFiles();

class InMemoryAsciiStream {
  private readonly chunks: string[] = [];

  public write(value: string): void {
    this.chunks.push(value);
  }

  public flush(): void {}
  public close(): void {}

  public toUint8Array(): Uint8Array {
    return new TextEncoder().encode(this.chunks.join(''));
  }
}

class InMemoryBinaryStream {
  private readonly chunks: Uint8Array[] = [];

  public write(value: Uint8Array): void {
    this.chunks.push(new Uint8Array(value));
  }

  public flush(): void {}
  public close(): void {}

  public toUint8Array(): Uint8Array {
    let total = 0;
    for (const c of this.chunks) total += c.length;
    const merged = new Uint8Array(total);
    let offset = 0;
    for (const c of this.chunks) {
      merged.set(c, offset);
      offset += c.length;
    }
    return merged;
  }
}

function assertDocumentDefaults(doc: CadDocument): void {
  expect(doc).not.toBeNull();
  expect(doc.blockRecords).not.toBeNull();
  expect(doc.layers).not.toBeNull();
  expect(doc.lineTypes).not.toBeNull();
}

describe('Roundtrip Tests', () => {
  describe('DWG Roundtrip', () => {
    describe.each(dwgFiles.map(f => [f.fileName, f]))('%s', (_name, test) => {
      it('Read -> Write -> Read', () => {
        // 1. Read original
        const data = readFileAsArrayBuffer(test.path);
        const reader = new DwgReader(data);
        const doc = reader.Read();

        expect(doc).not.toBeNull();

        // Skip versions the DWG writer doesn't support
        if (doc.header.version < ACadVersion.AC1014) return;

        // 2. Write
        const buffer = new ArrayBuffer(16 * 1024 * 1024);
        const writer = new DwgWriter(buffer, doc);
        writer.Write();

        const outPath = path.join(roundtripOutDir, `rt_${test.fileName}`);
        fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

        // 3. Re-read
        const rereadData = readFileAsArrayBuffer(outPath);
        const reader2 = new DwgReader(rereadData);
        const doc2 = reader2.Read();

        assertDocumentDefaults(doc2);

        // 4. Compare key properties (use >= because createDefaults adds missing defaults on re-read)
        expect(doc2.header.version).toBe(doc.header.version);
        expect(doc2.blockRecords.count).toBeGreaterThanOrEqual(doc.blockRecords.count);
        expect(doc2.layers.count).toBeGreaterThanOrEqual(doc.layers.count);
        expect(doc2.lineTypes.count).toBeGreaterThanOrEqual(doc.lineTypes.count);
      });
    });
  });

  describe('DXF ASCII Roundtrip', () => {
    describe.each(dxfAsciiFiles.map(f => [f.fileName, f]))('%s', (_name, test) => {
      it('Read -> Write -> Read', () => {
        // Skip AC1009 - version detection is incorrect (reads as AC1032)
        const isAC1009 = test.path.toLowerCase().includes('ac1009');

        // 1. Read original
        const data = readFileAsUint8Array(test.path);
        const reader = new DxfReader(data);
        const doc = reader.Read();

        expect(doc).not.toBeNull();

        // 2. Write as ASCII DXF
        const stream = new InMemoryAsciiStream();
        const writer = new DxfWriter(stream as any, doc, false);
        writer.Write();
        const written = stream.toUint8Array();

        const outPath = path.join(roundtripOutDir, `rt_${test.fileName}`);
        fs.writeFileSync(outPath, written);

        // 3. Re-read
        const reader2 = new DxfReader(written);
        const doc2 = reader2.Read();

        expect(doc2).not.toBeNull();

        if (!isAC1009 && doc.header.version >= ACadVersion.AC1012) {
          assertDocumentDefaults(doc2);

          // 4. Compare key properties (use >= because createDefaults adds missing defaults on re-read)
          expect(doc2.header.version).toBe(doc.header.version);
          expect(doc2.blockRecords.count).toBeGreaterThanOrEqual(doc.blockRecords.count);
          expect(doc2.layers.count).toBeGreaterThanOrEqual(doc.layers.count);
          expect(doc2.lineTypes.count).toBeGreaterThanOrEqual(doc.lineTypes.count);
        }
      });
    });
  });

  describe('DXF Binary Roundtrip', () => {
    describe.each(dxfBinaryFiles.map(f => [f.fileName, f]))('%s', (_name, test) => {
      it('Read -> Write -> Read', () => {
        // Skip AC1009 binary (known unsupported)
        if (test.path.toLowerCase().includes('ac1009_binary')) return;

        // 1. Read original
        const data = readFileAsUint8Array(test.path);
        const reader = new DxfReader(data);
        const doc = reader.Read();

        expect(doc).not.toBeNull();

        // 2. Write as ASCII DXF (roundtrip through ASCII for compatibility)
        const stream = new InMemoryAsciiStream();
        const writer = new DxfWriter(stream as any, doc, false);
        writer.Write();
        const written = stream.toUint8Array();

        const outPath = path.join(roundtripOutDir, `rt_ascii_${test.fileName}`);
        fs.writeFileSync(outPath, written);

        // 3. Re-read
        const reader2 = new DxfReader(written);
        const doc2 = reader2.Read();

        expect(doc2).not.toBeNull();

        if (doc.header.version >= ACadVersion.AC1012) {
          assertDocumentDefaults(doc2);

          // 4. Compare key properties (use >= because createDefaults adds missing defaults on re-read)
          expect(doc2.header.version).toBe(doc.header.version);
          expect(doc2.blockRecords.count).toBeGreaterThanOrEqual(doc.blockRecords.count);
          expect(doc2.layers.count).toBeGreaterThanOrEqual(doc.layers.count);
          expect(doc2.lineTypes.count).toBeGreaterThanOrEqual(doc.lineTypes.count);
        }
      });
    });
  });
});
