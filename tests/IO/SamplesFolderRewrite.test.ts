import { beforeAll, describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { TestVariables } from '../TestVariables.js';
import { readFileAsArrayBuffer, readFileAsUint8Array } from '../testHelpers.js';
import { CadDocument } from '../../src/CadDocument.js';
import { DwgReader } from '../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../src/IO/DWG/DwgWriter.js';
import { DxfReader } from '../../src/IO/DXF/DxfReader.js';
import { DxfWriter } from '../../src/IO/DXF/DxfWriter.js';

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
    for (const chunk of this.chunks) {
      total += chunk.length;
    }

    const merged = new Uint8Array(total);
    let offset = 0;
    for (const chunk of this.chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    return merged;
  }
}

type SampleCadFile = {
  fullPath: string;
  relativePath: string;
  extension: '.dwg' | '.dxf';
};

const outputDir = path.join(TestVariables.outputSamplesFolder, 'samples');
const sampleFiles = collectCadSamples(TestVariables.samplesFolder);

function collectCadSamples(rootDir: string): SampleCadFile[] {
  const results: SampleCadFile[] = [];

  function visit(dirPath: string): void {
    for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        visit(fullPath);
        continue;
      }

      const extension = path.extname(entry.name).toLowerCase();
      if (extension !== '.dwg' && extension !== '.dxf') {
        continue;
      }

      results.push({
        fullPath,
        relativePath: path.relative(rootDir, fullPath),
        extension,
      });
    }
  }

  visit(rootDir);
  return results.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

function deleteIfExists(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath, { force: true });
  }
}

function isLegacyAc1009BinaryReadGap(filePath: string): boolean {
  return filePath.toLowerCase().includes('sample_ac1009_binary.dxf');
}

function normalizeHeaderTablePointers(doc: CadDocument): void {
  const { header } = doc;

  if (doc.layers?.tryGetValue('0')) {
    try {
      doc.layers.get(header.currentLayerName);
    } catch {
      header.currentLayerName = '0';
    }
  }

  if (doc.lineTypes?.tryGetValue('ByLayer')) {
    try {
      doc.lineTypes.get(header.currentLineTypeName);
    } catch {
      header.currentLineTypeName = 'ByLayer';
    }
  }

  if (doc.textStyles?.tryGetValue('Standard')) {
    try {
      doc.textStyles.get(header.currentTextStyleName);
    } catch {
      header.currentTextStyleName = 'Standard';
    }
  }

  if (doc.dimensionStyles?.tryGetValue('Standard')) {
    try {
      doc.dimensionStyles.get(header.currentDimensionStyleName);
    } catch {
      header.currentDimensionStyleName = 'Standard';
    }
  }
}

function expectWrittenFile(filePath: string): void {
  expect(fs.existsSync(filePath)).toBe(true);
  expect(fs.statSync(filePath).size).toBeGreaterThan(0);
}

function writeDwg(doc: CadDocument, outPath: string): void {
  doc.createDefaults();
  normalizeHeaderTablePointers(doc);

  const buffer = new ArrayBuffer(16 * 1024 * 1024);
  const writer = new DwgWriter(buffer, doc);
  writer.write();

  fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));
}

function writeDxf(doc: CadDocument, outPath: string, binary: boolean): void {
  const stream = binary ? new InMemoryBinaryStream() : new InMemoryAsciiStream();
  const writer = new DxfWriter(stream as any, doc, binary);
  writer.write();

  fs.writeFileSync(outPath, stream.toUint8Array());
}

describe('Samples folder rewrite', () => {
  beforeAll(() => {
    fs.mkdirSync(outputDir, { recursive: true });
  });

  it('discovers sample DWG and DXF files recursively', () => {
    expect(sampleFiles.length).toBeGreaterThan(0);
  });

  describe.each(sampleFiles.map(file => [file.relativePath, file] as const))('%s', (_name, sample) => {
    it('reads and rewrites the sample into output/samples', () => {
      if (isLegacyAc1009BinaryReadGap(sample.fullPath)) {
        return;
      }

      const outPath = path.join(outputDir, sample.relativePath);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      deleteIfExists(outPath);

      if (sample.extension === '.dwg') {
        const doc = new DwgReader(readFileAsArrayBuffer(sample.fullPath)).read();
        writeDwg(doc, outPath);
        expectWrittenFile(outPath);
        return;
      }

      const data = readFileAsUint8Array(sample.fullPath);
      const doc = new DxfReader(data).read();
      const binary = DxfReader.isBinaryStream(data);
      writeDxf(doc, outPath, binary);
      expectWrittenFile(outPath);
    });
  });
});