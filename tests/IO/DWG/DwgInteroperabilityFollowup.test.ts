import { describe, expect, it, vi } from 'vitest';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { CadDocument } from '../../../src/CadDocument.js';
import { TableEntity } from '../../../src/Entities/TableEntity.js';
import { ModelerGeometry } from '../../../src/Entities/ModelerGeometry.js';
import { MText } from '../../../src/Entities/MText.js';
import { TableStyle } from '../../../src/Objects/TableStyle.js';
import { DwgReader } from '../../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../../src/IO/DWG/DwgWriter.js';
import { DwgWriterConfiguration } from '../../../src/IO/DWG/DwgWriterConfiguration.js';
import { DwgObjectReader } from '../../../src/IO/DWG/DwgStreamReaders/DwgObjectReader.js';
import { DwgObjectWriter } from '../../../src/IO/DWG/DwgStreamWriters/DwgObjectWriter.js';
import { IDwgStreamReader } from '../../../src/IO/DWG/DwgStreamReaders/IDwgStreamReader.js';
import { DwgStreamWriterBase } from '../../../src/IO/DWG/DwgStreamWriters/DwgStreamWriterBase.js';
import { DwgStreamReaderBase } from '../../../src/IO/DWG/DwgStreamReaders/DwgStreamReaderBase.js';
import { IDwgStreamWriter } from '../../../src/IO/DWG/DwgStreamWriters/IDwgStreamWriter.js';
import { XRecord } from '../../../src/Objects/XRecrod.js';
import { TestVariables } from '../../TestVariables.js';
import { readFileAsArrayBuffer } from '../../testHelpers.js';

describe('DWG interoperability follow-up to #11', () => {
  for (const target of [ACadVersion.AC1018, ACadVersion.AC1024]) {
    it(`preserves ASM binary geometry downgrading R2018 to ${ACadVersion[target]}`, () => {
      const document = new DwgReader(readFileAsArrayBuffer(path.join(TestVariables.samplesFolder, 'sample_AC1032.dwg'))).read();
      const geometry = [...document.entities].filter((entity): entity is ModelerGeometry => entity instanceof ModelerGeometry);
      expect(geometry).toHaveLength(3);
      for (const entity of geometry) expect(entity.isBinaryAcisData).toBe(true);
      document.header.version = target;
      const configuration = new DwgWriterConfiguration();
      configuration.writeLegacyAsmData = true;
      const bytes = DwgWriter.writeToBuffer(document, configuration);
      const reread = new DwgReader(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)).read();
      const actual = [...reread.entities].filter((entity): entity is ModelerGeometry => entity instanceof ModelerGeometry);
      const summary = (entity: ModelerGeometry) => ({ handle: entity.handle, payload: createHash('sha256').update(entity.binaryData).digest('hex') });
      expect(actual.map(summary)).toEqual(geometry.map(summary));
    });
  }
  for (const source of ['AC1014', 'AC1015']) {
    for (const target of [ACadVersion.AC1027, ACadVersion.AC1032]) {
      it(`preserves legacy ACIS flags and SAT text upgrading ${source} to ${ACadVersion[target]}`, () => {
        const document = new DwgReader(readFileAsArrayBuffer(path.join(TestVariables.samplesFolder, `sample_${source}.dwg`))).read();
        const geometry = [...document.entities].filter((entity): entity is ModelerGeometry => entity instanceof ModelerGeometry);
        expect(geometry).toHaveLength(3);
        for (const entity of geometry) {
          expect(entity.modelerDataFlag).toBe(true);
          expect(entity.getAcisText()).toMatch(/^(?:106|400) (?:112|42) 1 0/);
          expect(entity.binaryData).not.toContain(0x7f);
        }
        document.header.version = target;
        const bytes = DwgWriter.writeToBuffer(document);
        const reread = new DwgReader(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)).read();
        const actual = [...reread.entities].filter((entity): entity is ModelerGeometry => entity instanceof ModelerGeometry);
        const summary = (entity: ModelerGeometry) => ({
          handle: entity.handle,
          payload: createHash('sha256').update(entity.binaryData).digest('hex'),
        });
        expect(actual.map(summary)).toEqual(geometry.map(summary));
      });
    }
  }
  for (const version of ['AC1014', 'AC1015', 'AC1018', 'AC1024', 'AC1027', 'AC1032']) {
    it(`preserves modeler geometry when rewriting ${version}`, () => {
      const document = new DwgReader(readFileAsArrayBuffer(path.join(TestVariables.samplesFolder, `sample_${version}.dwg`))).read();
      const geometry = [...document.entities].filter((entity): entity is ModelerGeometry => entity instanceof ModelerGeometry);
      expect(geometry).toHaveLength(3);
      for (const entity of geometry) {
        expect(entity.binaryData.length).toBeGreaterThan(0);
        expect(entity.modelerDataFlag).toBe(version < 'AC1018' ? true : version < 'AC1027' ? false : null);
      }
      const bytes = DwgWriter.writeToBuffer(document);
      const rewritten = new DwgReader(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)).read();
      const reread = [...rewritten.entities].filter((entity): entity is ModelerGeometry => entity instanceof ModelerGeometry);
      const digest = (entity: ModelerGeometry) => createHash('sha256').update(entity.binaryData).digest('hex');
      expect(reread.map(digest)).toEqual(geometry.map(digest));
      expect(reread.map(entity => entity.modelerDataFlag)).toEqual(geometry.map(entity => entity.modelerDataFlag));
    });
  }
  for (const version of [ACadVersion.AC1018, ACadVersion.AC1032]) {
    it(`encodes ResBuf handles as 64-bit values in ${ACadVersion[version]}`, () => {
      const document = new CadDocument();
      document.header.version = version;
      const bytes = new Uint8Array(1024);
      const writer = DwgStreamWriterBase.getStreamWriter(version, bytes, 'windows-1252');
      const payloadWriter = new DwgObjectWriter(bytes, document, 'windows-1252') as unknown as {
        _writer: IDwgStreamWriter; _writeXRecord(record: XRecord): void;
      };
      payloadWriter._writer = writer;
      const record = new XRecord();
      record.createEntry(320, 0x1234);
      record.createEntry(70, 42);
      payloadWriter._writeXRecord(record);
      writer.writeShiftValue();
      const reader = DwgStreamReaderBase.getStreamHandler(version, bytes);
      expect(reader.readBitLong()).toBe(14);
      expect([...reader.readBytes(14)]).toEqual([64, 1, 0x34, 0x12, 0, 0, 0, 0, 0, 0, 70, 0, 42, 0]);
    });
  }

  for (const version of ['AC1024', 'AC1027', 'AC1032']) {
    it(`reads the complete original ${version} table and preserves cell content`, () => {
      type Internals = {
        _readTableEntity(): { cadObject: TableEntity };
        _objectReader: IDwgStreamReader;
        _textReader: IDwgStreamReader;
      };
      const prototype = DwgObjectReader.prototype as unknown as Internals;
      const original = prototype._readTableEntity;
      const positions: { actual: number; expected: number }[] = [];
      const spy = vi.spyOn(prototype, '_readTableEntity').mockImplementation(function(this: Internals) {
        const expected = this._textReader.positionInBits();
        const result = original.call(this);
        positions.push({ actual: this._objectReader.positionInBits(), expected });
        return result;
      });
      try {
        const reader = new DwgReader(readFileAsArrayBuffer(path.join(TestVariables.samplesFolder, `sample_${version}.dwg`)));
        const document = reader.read();
        expect(positions.length).toBeGreaterThan(0);
        for (const position of positions) expect(position.actual).toBe(position.expected);
        spy.mockRestore();
        const originalTables = [...document.entities].filter((entity): entity is TableEntity => entity instanceof TableEntity);
        expect(originalTables.length).toBeGreaterThan(0);
        const summarize = (table: TableEntity) => ({
          widths: table.columns.map(column => column.width),
          rows: table.rows.map(row => ({ height: row.height, cells: row.cells.map(cell => cell.contents.map(content => content.cadValue.value)) })),
          style: table.style?.name,
        });
        for (const table of originalTables) {
          expect(table.columns.length).toBeGreaterThan(0);
          expect(table.rows.length).toBeGreaterThan(0);
        }
        const bytes = DwgWriter.writeToBuffer(document);
        const reread = new DwgReader(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)).read();
        const tables = [...reread.entities].filter((entity): entity is TableEntity => entity instanceof TableEntity);
        expect(tables.map(summarize)).toEqual(originalTables.map(summarize));
      } finally { spy.mockRestore(); }
    });
  }

  it('writes non-graphical objects with a null owner without dereferencing it', () => {
    const document = new CadDocument();
    const writer = new DwgObjectWriter(new Uint8Array(4096), document, 'windows-1252') as unknown as {
      _writeCommonNonEntityData(object: XRecord): void;
    };
    const object = new XRecord();
    object.handle = 42;
    expect(() => writer._writeCommonNonEntityData(object)).not.toThrow();
  });

  it('upgrades an AC1018 sample with uninitialized viewport lighting to AC1032', () => {
    const document = new DwgReader(readFileAsArrayBuffer(path.join(TestVariables.samplesFolder, 'sample_AC1018.dwg'))).read();
    document.header.version = ACadVersion.AC1032;
    expect(() => DwgWriter.writeToBuffer(document)).not.toThrow();
  });

  it('migrates legacy table-style round-trip metadata when upgrading', () => {
    const document = new DwgReader(readFileAsArrayBuffer(path.join(TestVariables.samplesFolder, 'sample_AC1018.dwg'))).read();
    document.header.version = ACadVersion.AC1024;
    const output = DwgWriter.writeToBuffer(document);
    const reread = new DwgReader(output.buffer.slice(output.byteOffset, output.byteOffset + output.byteLength)).read();
    const style = reread.getCadObject(135) as TableStyle;
    expect(style.dataCellStyle.valueDataType).toBe(512);
    expect(style.headerCellStyle.valueDataType).toBe(512);
    expect(style.titleCellStyle.valueDataType).toBe(512);
    expect(style.xDictionary?.getEntry('ACAD_XREC_ROUNDTRIP')).toBeNull();
  });

  it('consumes complete original R2018 MTEXT payloads including text frames', () => {
    type Internals = {
      _readMText(): { cadObject: MText };
      _objectReader: IDwgStreamReader;
      _textReader: IDwgStreamReader;
    };
    const prototype = DwgObjectReader.prototype as unknown as Internals;
    const original = prototype._readMText;
    const positions: { actual: number; expected: number }[] = [];
    const spy = vi.spyOn(prototype, '_readMText').mockImplementation(function(this: Internals) {
      const expected = this._textReader.positionInBits();
      const result = original.call(this);
      positions.push({ actual: this._objectReader.positionInBits(), expected });
      return result;
    });
    try {
      new DwgReader(readFileAsArrayBuffer(path.join(TestVariables.samplesFolder, 'sample_AC1032.dwg'))).read();
      expect(positions.length).toBeGreaterThan(0);
      for (const position of positions) expect(position.actual).toBe(position.expected);
    } finally { spy.mockRestore(); }
  });
});

describe.skipIf(!process.env.ODA_FILE_CONVERTER)('ODA interoperability', () => {
  it('audits solid, region and body payloads through multiple blob pages', () => {
    execFileSync(process.execPath, ['tools/check-dwg-oda-blobs.mjs', process.env.ODA_FILE_CONVERTER!], {
      cwd: process.cwd(), stdio: 'pipe', timeout: 300000, windowsHide: true,
    });
  }, 300000);
  it('audits originals and the public sample version matrix', () => {
    // Requires npm run build and an explicitly configured local converter.
    execFileSync(process.execPath, ['tools/check-dwg-oda.mjs', process.env.ODA_FILE_CONVERTER!, '--matrix'], {
      cwd: process.cwd(), stdio: 'pipe', timeout: 300000, windowsHide: true,
    });
  }, 300000);
});
