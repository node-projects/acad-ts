import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import { TestVariables } from '../../TestVariables.js';
import { DxfWriter } from '../../../src/IO/DXF/DxfWriter.js';
import { DxfReader } from '../../../src/IO/DXF/DxfReader.js';
import { DxfWriterConfiguration } from '../../../src/IO/DXF/DxfWriterConfiguration.js';
import { CadDocument } from '../../../src/CadDocument.js';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { Line } from '../../../src/Entities/Line.js';
import { Point } from '../../../src/Entities/Point.js';
import { Arc } from '../../../src/Entities/Arc.js';
import { TextEntity } from '../../../src/Entities/TextEntity.js';
import { Region } from '../../../src/Entities/Region.js';
import { CadBody } from '../../../src/Entities/CadBody.js';
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
  it.each([ACadVersion.AC1012, ACadVersion.AC1014])('filters modeler entities by supported DXF version %s', version => {
    const document = new CadDocument(version);
    document.entities.add(new CadBody());
    document.entities.add(new Region());
    document.entities.add(new Solid3D());
    const stream = new InMemoryAsciiStream();
    DxfWriter.writeToStream(stream, document);
    const entities = [...DxfReader.readFromStream(stream.toUint8Array()).entities];
    expect(entities.filter(entity => entity instanceof CadBody || entity instanceof Region || entity instanceof Solid3D))
      .toHaveLength(version < ACadVersion.AC1014 ? 0 : 3);
  });
  it('can omit R2013+ ACIS storage without omitting its entity', () => {
    const doc = new CadDocument(ACadVersion.AC1027);
    const region = new Region();
    region.acisData = new TextEncoder().encode('ACIS BinaryFile payload');
    doc.entities.add(region);
    const configuration = new DxfWriterConfiguration();
    expect(configuration.writeACISData).toBe(true);
    configuration.writeACISData = false;
    const stream = new InMemoryAsciiStream();
    DxfWriter.writeToStream(stream, doc, false, configuration);
    expect(new TextDecoder().decode(stream.toUint8Array())).not.toContain('ACDSDATA');
    const reread = [...DxfReader.readFromStream(stream.toUint8Array()).entities].find(entity => entity instanceof Region) as Region;
    expect(reread).toBeDefined();
    expect(reread.acisData).toHaveLength(0);
  });
  const doubleRoundTripCases: [number, number | null, number][] = [
    4.656612873077393e-10, -4.656612873077393e-10, 1.2345678901234568e-10,
    2.5e-20, 1.5e-30, 1.5e-40, 1.5e-100, 1.5e+30, 9.9e+30,
    1e-10, 5e-10, 2.5e-11, 1.234e-7, 1e-9, 0, 0.1, 1.5, 100,
    1234.5678, 38525802.91236212, Number.MIN_VALUE, Number.MAX_VALUE,
  ].map(value => [value, null, value]);
  doubleRoundTripCases.push(
    [1.5e+30, 6, 1.5e+30],
    [-9.9e+30, 6, -9.9e+30],
    [1.5e+100, 6, 1.5e+100],
    [1.5, 6, 1.5],
    [100, 6, 100],
    [1234.567891234, 6, 1234.567891],
    [4.656612873077393e-10, 6, 0],
    [1.5, 0, 2],
  );

  it.each(doubleRoundTripCases)(
    'round-trips ASCII double %s with decimalPrecision %s as %s',
    (value, precision, expected) => {
      const doc = new CadDocument(ACadVersion.AC1021);
      const line = new Line();
      line.startPoint.y = value;
      line.endPoint.x = 10;
      line.endPoint.y = value;
      doc.entities.add(line);

      const configuration = new DxfWriterConfiguration();
      configuration.decimalPrecision = precision;
      const stream = new InMemoryAsciiStream();
      DxfWriter.writeToStream(stream, doc, false, configuration);

      const reread = DxfReader.readFromStream(stream.toUint8Array());
      const rereadLine = [...reread.entities].find((entity): entity is Line => entity instanceof Line);

      expect(rereadLine).toBeDefined();
      expect(rereadLine?.startPoint.y).toBe(expected);
      expect(rereadLine?.endPoint.y).toBe(expected);
    },
  );

  it.each([
    ['ASCII', false],
    ['binary', true],
  ] as const)('round-trips R2013 modeler payloads in %s DXF', (_label, binary) => {
    const doc = new CadDocument(ACadVersion.AC1027);
    const region = new Region();
    const solid = new Solid3D();
    const body = new CadBody();
    body.acisData = new TextEncoder().encode('ACIS BinaryFile body payload');
    body.guid = '{01234567-89ab-cdef-0123-456789abcdef}';
    region.acisData = Uint8Array.from({ length: 300 }, (_, index) => index & 0xFF);
    solid.acisData = new TextEncoder().encode('ACIS BinaryFile solid payload');
    doc.entities.add(region);
    doc.entities.add(solid);
    doc.entities.add(body);

    const stream = binary ? new InMemoryBinaryStream() : new InMemoryAsciiStream();
    new DxfWriter(stream as any, doc, binary).write();

    const reread = new DxfReader(stream.toUint8Array()).read();
    const rereadRegion = [...reread.entities].find((entity): entity is Region => entity instanceof Region);
    const rereadSolid = [...reread.entities].find((entity): entity is Solid3D => entity instanceof Solid3D);

    expect(rereadRegion?.acisData).toEqual(region.acisData);
    expect(rereadSolid?.acisData).toEqual(solid.acisData);
    const rereadBody = [...reread.entities].find((entity): entity is CadBody => entity instanceof CadBody);
    expect(rereadBody?.acisData).toEqual(body.acisData);
    expect(rereadBody?.guid).toBe(body.guid);
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

      const expected = version >= ACadVersion.AC1021
        ? new TextEncoder().encode('layer-säöü')
        : [0x6C, 0x61, 0x79, 0x65, 0x72, 0x2D, 0x73, 0xE4, 0xF6, 0xFC];
      expect(containsByteSequence(output, Array.from(expected))).toBe(true);
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

      const expected = version >= ACadVersion.AC1021
        ? new TextEncoder().encode('layer-säöü')
        : [0x6C, 0x61, 0x79, 0x65, 0x72, 0x2D, 0x73, 0xE4, 0xF6, 0xFC];
      expect(containsByteSequence(data, Array.from(expected))).toBe(true);
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
