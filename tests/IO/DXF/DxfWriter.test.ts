import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import { TestVariables } from '../../TestVariables.js';
import { DxfWriter } from '../../../src/IO/DXF/DxfWriter.js';
import { DxfReader } from '../../../src/IO/DXF/DxfReader.js';
import { CadDocument } from '../../../src/CadDocument.js';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { Line } from '../../../src/Entities/Line.js';
import { Point } from '../../../src/Entities/Point.js';
import { Arc } from '../../../src/Entities/Arc.js';
import { TextEntity } from '../../../src/Entities/TextEntity.js';
import { Region } from '../../../src/Entities/Region.js';
import { Solid3D } from '../../../src/Entities/Solid3D.js';
import { Layer } from '../../../src/Tables/Layer.js';

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
    for (const c of this.chunks) {
      total += c.length;
    }

    const merged = new Uint8Array(total);
    let offset = 0;
    for (const c of this.chunks) {
      merged.set(c, offset);
      offset += c.length;
    }
    return merged;
  }
}

function containsByteSequence(data: Uint8Array, sequence: number[]): boolean {
  for (let i = 0; i <= data.length - sequence.length; i++) {
    let matched = true;
    for (let j = 0; j < sequence.length; j++) {
      if (data[i + j] !== sequence[j]) {
        matched = false;
        break;
      }
    }

    if (matched) {
      return true;
    }
  }

  return false;
}

describe('DxfWriterTests', () => {
  it.each([
    ['ASCII', false],
    ['binary', true],
  ] as const)('round-trips R2013 modeler payloads in %s DXF', (_label, binary) => {
    const doc = new CadDocument(ACadVersion.AC1027);
    const region = new Region();
    const solid = new Solid3D();
    region.acisData = Uint8Array.from({ length: 300 }, (_, index) => index & 0xFF);
    solid.acisData = new TextEncoder().encode('ACIS BinaryFile solid payload');
    doc.entities.add(region);
    doc.entities.add(solid);

    const stream = binary ? new InMemoryBinaryStream() : new InMemoryAsciiStream();
    new DxfWriter(stream as any, doc, binary).write();

    const reread = new DxfReader(stream.toUint8Array()).read();
    const rereadRegion = [...reread.entities].find((entity): entity is Region => entity instanceof Region);
    const rereadSolid = [...reread.entities].find((entity): entity is Solid3D => entity instanceof Solid3D);

    expect(rereadRegion?.acisData).toEqual(region.acisData);
    expect(rereadSolid?.acisData).toEqual(solid.acisData);
  });

  it('round-trips inline SAT text in pre-R2013 DXF', () => {
    const doc = new CadDocument(ACadVersion.AC1024);
    const region = new Region();
    const sat = `400 0 1 0\nbody ${'x'.repeat(300)} #`;
    region.acisData = new TextEncoder().encode(sat);
    doc.entities.add(region);

    const stream = new InMemoryAsciiStream();
    new DxfWriter(stream as any, doc, false).write();

    const reread = new DxfReader(stream.toUint8Array()).read();
    const rereadRegion = [...reread.entities].find((entity): entity is Region => entity instanceof Region);

    expect(rereadRegion?.getAcisText()).toBe(sat);
  });

  describe.each(versions.map(v => [ACadVersion[v] ?? `v${v}`, v]))('Version %s', (_name, version) => {
    it('WriteEmptyAscii', () => {
      if (version < ACadVersion.AC1015) return;

      const doc = new CadDocument();
      if (doc.header) doc.header.version = version;

      const outPath = path.join(TestVariables.outputSamplesFolder, `out_empty_sample_${ACadVersion[version]}_ascii.dxf`);

      // Write using a stream-like target expected by the current TS DXF writer.
      const stream = new InMemoryAsciiStream();
      const writer = new DxfWriter(stream as any, doc, false);
      writer.write();
      const data = stream.toUint8Array();

      // Save output
      fs.writeFileSync(outPath, data);

      // Read back
      const reader = new DxfReader(data);
      const readed = reader.read();
      expect(readed).not.toBeNull();
    });

    it('WriteEmptyBinary', () => {
      if (version < ACadVersion.AC1015) return;

      const doc = new CadDocument();
      if (doc.header) doc.header.version = version;

      const outPath = path.join(TestVariables.outputSamplesFolder, `out_empty_sample_${ACadVersion[version]}_binary.dxf`);

      // Write using a stream-like target expected by the current TS DXF writer.
      const stream = new InMemoryBinaryStream();
      const writer = new DxfWriter(stream as any, doc, true);
      writer.write();
      const data = stream.toUint8Array();

      // Save output
      fs.writeFileSync(outPath, data);

      // Read back
      const reader = new DxfReader(data);
      const readed = reader.read();
      expect(readed).not.toBeNull();
    });

    it('WriteDocumentWithEntities', () => {
      if (version < ACadVersion.AC1015) return;

      const doc = new CadDocument();
      if (doc.header) doc.header.version = version;

      const entities = [
        new Point(),
        new Line(),
        new Line(),
        new Arc(),
      ];

      if (doc.entities && typeof doc.entities.add === 'function') {
        for (const e of entities) {
          doc.entities.add(e);
        }
      }

      const outPath = path.join(TestVariables.outputSamplesFolder, `out_sample_${ACadVersion[version]}_ascii.dxf`);

      const stream = new InMemoryAsciiStream();
      const writer = new DxfWriter(stream as any, doc, false);
      writer.write();
      const data = stream.toUint8Array();

      fs.writeFileSync(outPath, data);
    });

    it('WriteAsciiAnsi1252SpecialChars', () => {
      if (version < ACadVersion.AC1015) return;

      const doc = new CadDocument();
      if (doc.header) {
        doc.header.version = version;
        doc.header.codePage = 'ANSI_1252';
      }

      doc.layers.add(new Layer('layer-säöü'));

      const output = new Uint8Array(1024 * 1024);
      const writer = new DxfWriter(output, doc, false);
      writer.write();

      expect(containsByteSequence(output, [0x6C, 0x61, 0x79, 0x65, 0x72, 0x2D, 0x73, 0xE4, 0xF6, 0xFC])).toBe(true);
    });

    it('WriteBinaryAnsi1252SpecialChars', () => {
      if (version < ACadVersion.AC1015) return;

      const doc = new CadDocument();
      if (doc.header) {
        doc.header.version = version;
        doc.header.codePage = 'ANSI_1252';
      }

      doc.layers.add(new Layer('layer-säöü'));

      const stream = new InMemoryBinaryStream();
      const writer = new DxfWriter(stream as any, doc, true);
      writer.write();
      const data = stream.toUint8Array();

      expect(containsByteSequence(data, [0x6C, 0x61, 0x79, 0x65, 0x72, 0x2D, 0x73, 0xE4, 0xF6, 0xFC])).toBe(true);
    });

    it('WriteAsciiLongTextEntityRoundtrip', () => {
      if (version < ACadVersion.AC1015) return;

      const doc = new CadDocument();
      if (doc.header) doc.header.version = version;

      const longText = 'A'.repeat(300);
      const text = new TextEntity();
      text.value = longText;
      doc.entities.add(text);

      const stream = new InMemoryAsciiStream();
      const writer = new DxfWriter(stream as any, doc, false);
      writer.write();

      const reread = new DxfReader(stream.toUint8Array()).read();
      const rereadText = [...reread.entities].find((entity): entity is TextEntity => entity instanceof TextEntity);

      expect(rereadText?.value).toBe(longText);
    });
  });
});
