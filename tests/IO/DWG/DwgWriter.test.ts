import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import { TestVariables } from '../../TestVariables.js';
import { readFileAsArrayBuffer } from '../../testHelpers.js';
import { DwgWriter } from '../../../src/IO/DWG/DwgWriter.js';
import { DwgReader } from '../../../src/IO/DWG/DwgReader.js';
import { DwgStreamWriterBase } from '../../../src/IO/DWG/DwgStreamWriters/DwgStreamWriterBase.js';
import '../../../src/IO/DWG/DwgStreamWriters/DwgStreamWriterFactory.js';
import { DwgStreamReaderBase } from '../../../src/IO/DWG/DwgStreamReaders/DwgStreamReaderBase.js';
import '../../../src/IO/DWG/DwgStreamReaders/DwgStreamReaderFactory.js';
import { CadDocument } from '../../../src/CadDocument.js';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { Line } from '../../../src/Entities/Line.js';
import { Point } from '../../../src/Entities/Point.js';
import { ProxyEntity } from '../../../src/Entities/ProxyEntity.js';
import { DxfClass } from '../../../src/Classes/DxfClass.js';
import { DxfSubclassMarker } from '../../../src/DxfSubclassMarker.js';
import { DxfFileToken } from '../../../src/DxfFileToken.js';
import { getDecoderEncodingLabel } from '../../../src/IO/TextEncoding.js';

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
        writer.write();
        fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

        // Read back
        const readData = readFileAsArrayBuffer(outPath);
        const reader = new DwgReader(readData);
        const readed = reader.read();
        expect(readed).not.toBeNull();
      } else {
        expect(() => writer.write()).toThrow();
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
      writer.write();

      fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

      // Read back
      const readData = readFileAsArrayBuffer(outPath);
      const reader = new DwgReader(readData);
      const readed = reader.read();
      expect(readed).not.toBeNull();
    });

    it('WriteAnsi1252SpecialChars', () => {
      if (!isSupportedVersion(version)) return;

      const text = 'säöü';
      const stream = new Uint8Array(64);
      const writer = DwgStreamWriterBase.getStreamWriter(version, stream, 'ANSI_1252');
      writer.writeVariableText(text);

      const written = new Uint8Array(writer.stream).slice(0, Math.ceil(writer.positionInBits / 8));
      const reader = DwgStreamReaderBase.getStreamHandler(version, written, getDecoderEncodingLabel('ANSI_1252'));

      expect(reader.readVariableText()).toBe(text);
    });

    it('WriteSummaryTest', () => {
      if (version <= ACadVersion.AC1015) return;
      if (!isSupportedVersion(version)) return;

      const doc = new CadDocument();
      if (doc.header) {
        doc.header.version = version;
        doc.header.codePage = 'ANSI_1252';
      }
      doc.summaryInfo = {
        title: 'This is a random title säöü',
        subject: 'This is a subject säöü',
        author: 'Jörg säöü',
        keywords: 'My Keywords säöü',
        comments: 'This is my comment säöü',
      } as any;

      const buffer = new ArrayBuffer(1024 * 1024);
      const writer = new DwgWriter(buffer, doc);
      writer.write();

      const readBuffer = buffer.slice(0);
      const reader = new DwgReader(readBuffer);
      const info = reader.readSummaryInfo();

      if (info) {
        expect(info.title).toBe(doc.summaryInfo!.title);
        expect(info.subject).toBe(doc.summaryInfo!.subject);
        expect(info.author).toBe(doc.summaryInfo!.author);
        expect(info.keywords).toBe(doc.summaryInfo!.keywords);
        expect(info.comments).toBe(doc.summaryInfo!.comments);
      }
    });
  });

  it('WriteProxyEntityRoundtrip', () => {
    const version = ACadVersion.AC1021;
    const doc = new CadDocument();
    doc.createDefaults();
    doc.header.version = version;

    const proxyClass = Object.assign(new DxfClass(), {
      applicationName: 'ObjectDBX Classes',
      classNumber: 700,
      cppClassName: DxfSubclassMarker.proxyEntity,
      dxfName: DxfFileToken.entityProxyEntity,
      dwgVersion: version,
      maintenanceVersion: 0,
      wasZombie: false,
    });
    proxyClass.isAnEntity = true;
    doc.classes?.addOrUpdate(proxyClass);

    const proxy = new ProxyEntity();
    proxy.dxfClass = proxyClass;
    proxy.version = version;
    proxy.originalDataFormatDxf = false;
    doc.entities.add(proxy);

    const buffer = new ArrayBuffer(1024 * 1024);
    const writer = new DwgWriter(buffer, doc);
    writer.write();

    const reread = new DwgReader(buffer.slice(0)).read();
    const proxies = [...reread.entities].filter((entity): entity is ProxyEntity => entity instanceof ProxyEntity);

    expect(proxies).toHaveLength(1);
    expect(proxies[0].dxfClass?.classNumber).toBe(proxyClass.classNumber);
    expect(proxies[0].version).toBe(version);
  });
});
