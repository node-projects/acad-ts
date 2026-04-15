import { beforeAll, describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { TestVariables } from '../TestVariables.js';
import { getDwgFiles, getDxfAsciiFiles, readFileAsArrayBuffer, readFileAsUint8Array } from '../testHelpers.js';
import { CadDocument } from '../../src/CadDocument.js';
import { ACadVersion } from '../../src/ACadVersion.js';
import { DxfReader } from '../../src/IO/DXF/DxfReader.js';
import { DxfWriter } from '../../src/IO/DXF/DxfWriter.js';
import { DwgReader } from '../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../src/IO/DWG/DwgWriter.js';

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

const dwgFiles = getDwgFiles();
const dxfAsciiFiles = getDxfAsciiFiles();

function isWritableDwgVersion(version: ACadVersion): boolean {
  return version >= ACadVersion.AC1014;
}

function isAc1009Sample(filePath: string): boolean {
  return filePath.toLowerCase().includes('ac1009');
}

function deleteIfExists(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath, { force: true });
  }
}

function expectFileWritten(filePath: string): void {
  expect(fs.existsSync(filePath)).toBe(true);
  expect(fs.statSync(filePath).size).toBeGreaterThan(0);
}

function readDwgDocument(filePath: string): CadDocument {
  const reader = new DwgReader(readFileAsArrayBuffer(filePath));
  return reader.Read();
}

function readDxfDocument(filePath: string): CadDocument {
  const reader = new DxfReader(readFileAsUint8Array(filePath));
  return reader.Read();
}

function transferEntities(source: CadDocument): CadDocument {
  const transfer = new CadDocument();
  transfer.header.version = source.header.version;

  const entities = [...source.entities];
  for (const entity of entities) {
    const moved = source.entities.remove(entity);
    if (moved) {
      transfer.entities.add(moved);
    }
  }

  return transfer;
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

function writeDwgFile(outPath: string, doc: CadDocument): boolean {
  if (!TestVariables.localEnv || !isWritableDwgVersion(doc.header.version)) {
    return false;
  }

  deleteIfExists(outPath);
  doc.createDefaults();
  normalizeHeaderTablePointers(doc);

  const buffer = new ArrayBuffer(16 * 1024 * 1024);
  const writer = new DwgWriter(buffer, doc);
  writer.Write();

  fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));
  expectFileWritten(outPath);
  return true;
}

function writeDxfFile(outPath: string, doc: CadDocument): void {
  deleteIfExists(outPath);

  const stream = new InMemoryAsciiStream();
  const writer = new DxfWriter(stream as any, doc, false);
  writer.Write();

  fs.writeFileSync(outPath, stream.toUint8Array());
  expectFileWritten(outPath);
}

describe('Ported IOTests', () => {
  beforeAll(() => {
    fs.mkdirSync(TestVariables.outputSamplesFolder, { recursive: true });
  });

  describe.each(dwgFiles.map(file => [file.fileName, file] as const))('DWG sample %s', (_name, sample) => {
    it('DwgEntitiesToDwgFile', () => {
      const doc = readDwgDocument(sample.path);
      if (!isWritableDwgVersion(doc.header.version)) {
        return;
      }

      const transfer = transferEntities(doc);
      const outPath = path.join(TestVariables.outputSamplesFolder, `${sample.noExtensionName}_moved_out.dwg`);
      writeDwgFile(outPath, transfer);
    });

    it('DwgEntitiesToDxfFile', () => {
      const doc = readDwgDocument(sample.path);
      const transfer = transferEntities(doc);
      const outPath = path.join(TestVariables.outputSamplesFolder, `${sample.noExtensionName}_moved_to.dxf`);
      writeDxfFile(outPath, transfer);
    });

    it('DwgToDwg', () => {
      const doc = readDwgDocument(sample.path);
      if (!isWritableDwgVersion(doc.header.version)) {
        return;
      }

      const outPath = path.join(TestVariables.outputSamplesFolder, `${sample.noExtensionName}_out.dwg`);
      writeDwgFile(outPath, doc);
    });

    it('DwgToDxf', () => {
      const doc = readDwgDocument(sample.path);
      const outPath = path.join(TestVariables.outputSamplesFolder, `${sample.noExtensionName}_out.dxf`);
      writeDxfFile(outPath, doc);
    });
  });

  describe.each(dxfAsciiFiles.map(file => [file.fileName, file] as const))('DXF ASCII sample %s', (_name, sample) => {
    it('DxfEntitiesToDwgFile', () => {
      if (isAc1009Sample(sample.path)) {
        return;
      }

      const doc = readDxfDocument(sample.path);
      if (!isWritableDwgVersion(doc.header.version)) {
        return;
      }

      const transfer = transferEntities(doc);
      const outPath = path.join(TestVariables.outputSamplesFolder, `${sample.noExtensionName}_moved_to.dwg`);
      writeDwgFile(outPath, transfer);
    });

    it('DxfToDwg', () => {
      if (isAc1009Sample(sample.path)) {
        return;
      }

      const doc = readDxfDocument(sample.path);
      if (!isWritableDwgVersion(doc.header.version)) {
        return;
      }

      const outPath = path.join(TestVariables.outputSamplesFolder, `${sample.noExtensionName}_dxf_to.dwg`);
      writeDwgFile(outPath, transferEntities(doc));
    });

    it('DxfToDxf', () => {
      if (isAc1009Sample(sample.path)) {
        return;
      }

      const doc = readDxfDocument(sample.path);
      if (doc.header.version < ACadVersion.AC1012) {
        return;
      }

      const outPath = path.join(TestVariables.outputSamplesFolder, `${sample.noExtensionName}_rewrite_out.dxf`);
      writeDxfFile(outPath, doc);
    });
  });

  it('EmptyDwgToDxf', () => {
    const inPath = path.join(TestVariables.samplesFolder, 'sample_base', 'empty.dwg');
    expect(fs.existsSync(inPath)).toBe(true);

    const doc = readDwgDocument(inPath);
    const outPath = path.join(TestVariables.outputSamplesFolder, 'empty_out.dxf');
    writeDxfFile(outPath, doc);
  });
});