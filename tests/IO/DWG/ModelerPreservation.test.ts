import { describe, expect, it } from 'vitest';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { CadDocument } from '../../../src/CadDocument.js';
import { Solid3D } from '../../../src/Entities/Solid3D.js';
import { Region } from '../../../src/Entities/Region.js';
import { CadBody } from '../../../src/Entities/CadBody.js';
import { ModelerGeometry, ModelerGeometrySilhouette, ModelerGeometryWire } from '../../../src/Entities/ModelerGeometry.js';
import { XYZ } from '../../../src/Math/XYZ.js';
import { DwgReader } from '../../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../../src/IO/DWG/DwgWriter.js';
import { DwgWriterConfiguration } from '../../../src/IO/DWG/DwgWriterConfiguration.js';
import { DwgObjectWriter } from '../../../src/IO/DWG/DwgStreamWriters/DwgObjectWriter.js';
import { DwgObjectReader } from '../../../src/IO/DWG/DwgStreamReaders/DwgObjectReader.js';
import { DwgStreamWriterBase } from '../../../src/IO/DWG/DwgStreamWriters/DwgStreamWriterBase.js';
import { DwgStreamReaderBase } from '../../../src/IO/DWG/DwgStreamReaders/DwgStreamReaderBase.js';
import { IDwgStreamWriter } from '../../../src/IO/DWG/DwgStreamWriters/IDwgStreamWriter.js';
import { readFileSync } from 'node:fs';
import { DwgClassesWriter } from '../../../src/IO/DWG/DwgStreamWriters/DwgClassesWriter.js';

const bytes = (text: string) => new TextEncoder().encode(text);
const versions = [ACadVersion.AC1014, ACadVersion.AC1015, ACadVersion.AC1018, ACadVersion.AC1021, ACadVersion.AC1024, ACadVersion.AC1027, ACadVersion.AC1032];
function roundtrip(document: CadDocument, configuration?: DwgWriterConfiguration, messages: string[] = []): CadDocument {
  const output = DwgWriter.writeToBuffer(document, configuration, (_, e) => messages.push(e.message));
  return new DwgReader(output).read();
}

describe('PR 1350 modeler preservation', () => {
  it.each([ACadVersion.AC1018, ACadVersion.AC1021, ACadVersion.AC1024, ACadVersion.AC1027, ACadVersion.AC1032])('uses 499 for an empty class-section maximum in %s', version => {
    const buffer = new Uint8Array(4096);
    const document = new CadDocument(version);
    const writer = new DwgClassesWriter(buffer, document, 'windows-1252');
    writer.write();
    const reader = DwgStreamReaderBase.getStreamHandler(version, buffer);
    reader.readBytes(16); // Section sentinel.
    reader.readRawLong(); // Section size.
    if ((version >= ACadVersion.AC1024 && document.header.maintenanceVersion > 3) || version > ACadVersion.AC1027) reader.readRawLong(); // Extended size.
    if (version >= ACadVersion.AC1021) reader.readRawLong(); // Object data bit size.
    expect(version >= ACadVersion.AC1021 ? reader.readBitLong() : reader.readBitShort()).toBe(499);
  });

  it.each([ACadVersion.AC1021, ACadVersion.AC1027, ACadVersion.AC1032])('preserves mixed markers and secondary-only streams in %s', version => {
    const document = new CadDocument(version);
    const configuration = new DwgWriterConfiguration(); configuration.writeLegacyAsmData = true;
    for (const primary of ['', 'ASM BinaryFile primary End-of-ASM-data', '700 0 1 0\nbody #']) {
      const geometry = new Region();
      geometry.acisData = bytes(primary);
      geometry.secondaryAcisData = bytes('ACIS BinaryFile secondary End-of-ACIS-data');
      geometry.secondaryModelerDataFlag = true;
      document.entities.add(geometry);
    }
    const restored = roundtrip(roundtrip(document, configuration), configuration);
    for (const [index, actual] of [...restored.entities].entries()) {
      const expected = [...document.entities][index] as Region;
      expect((actual as Region).acisData).toEqual(expected.acisData);
      expect((actual as Region).secondaryAcisData).toEqual(expected.secondaryAcisData);
      expect((actual as Region).secondaryModelerDataFlag).toBe(true);
    }
  });

  // Public reproducer by ilCosmico, retained by ACadSharp PR #1350 at cc7a5dcd.
  it.each([ACadVersion.AC1018, ACadVersion.AC1021, ACadVersion.AC1024, ACadVersion.AC1027, ACadVersion.AC1032])('reads native 2007 silhouettes and rewrites them as %s', version => {
    const document = new DwgReader(readFileSync('samples/modeler/silhouette_sab_AC1021.dwg')).read();
    const source = [...document.entities].filter((entity): entity is ModelerGeometry => entity instanceof ModelerGeometry);
    expect(source.length).toBeGreaterThan(0);
    expect(source.some(entity => entity.silhouettes.length > 0)).toBe(true);
    document.header.version = version;
    const actual = [...roundtrip(document).entities].filter((entity): entity is ModelerGeometry => entity instanceof ModelerGeometry);
    expect(actual.length).toBe(source.length);
    for (const [index, geometry] of actual.entries()) {
      expect(geometry.acisData).toEqual(source[index].acisData);
      expect(geometry.silhouettes).toEqual(source[index].silhouettes);
    }
  });

  it.each([ACadVersion.AC1021, ACadVersion.AC1027])('writes SAT text flag, block lengths and material count without a wireframe bit in %s', version => {
    const document = new CadDocument(version);
    const geometry = new Region();
    geometry.acisData = bytes('a'.repeat(4097));
    geometry.modelerDataFlag = false;
    const buffer = new Uint8Array(8192);
    const stream = DwgStreamWriterBase.getStreamWriter(version, buffer, 'windows-1252');
    const writer = new DwgObjectWriter(buffer, document, 'windows-1252') as unknown as {
      _writer: IDwgStreamWriter; _writeModelerGeometry(geometry: ModelerGeometry): void;
    };
    writer._writer = stream;
    writer._writeModelerGeometry(geometry);
    stream.writeBitLong(12345);
    const reader = DwgStreamReaderBase.getStreamHandler(version, buffer);
    expect(reader.readBit()).toBe(false);
    expect(reader.readBit()).toBe(true);
    expect(reader.readBitShort()).toBe(1);
    expect(reader.readBitLong()).toBe(4096);
    expect(reader.readBytes(4096)).toEqual(new Uint8Array(4096).fill(0x9f - 0x61));
    expect(reader.readBitLong()).toBe(1);
    expect(reader.readByte()).toBe(0x9f - 0x61);
    expect(reader.readBitLong()).toBe(0);
    expect(reader.readBit()).toBe(false); // No wireframe; no secondary empty bit follows.
    expect(reader.readBitLong()).toBe(0); // Material count even for SAT.
    if (version >= ACadVersion.AC1027) {
      expect(reader.readBit()).toBe(false);
      expect(reader.readBitLong()).toBe(0);
      expect(reader.readBitShort()).toBe(0);
      expect(reader.readBitShort()).toBe(0);
      expect(reader.readBytes(8)).toEqual(new Uint8Array(8));
      expect(reader.readBitLong()).toBe(0);
    }
    expect(reader.readBitLong()).toBe(12345);
  });

  it.each(versions)('keeps separate primary/secondary SAT data and trailers in %s', version => {
    const document = new CadDocument(version);
    for (const Type of [Solid3D, Region, CadBody]) {
      const geometry = new Type();
      geometry.acisData = bytes('700 0 1 0\n' + 'body record #\n'.repeat(500) + 'End-of-ACIS-data');
      geometry.modelerDataFlag = false; // SAT must still be emitted as text.
      geometry.secondaryAcisData = bytes('700 0 1 0\nauxiliary edges #\nEnd-of-ACIS-data');
      geometry.secondaryModelerDataFlag = false;
      geometry.secondaryModelerFormatVersion = 1;
      const silhouette = new ModelerGeometrySilhouette();
      silhouette.viewportId = version >= ACadVersion.AC1024 ? 0x123456789 : -2147483648;
      silhouette.viewportTarget = new XYZ(1, 2, 3);
      const wire = new ModelerGeometryWire();
      wire.type = 4; wire.acisIndex = 17; wire.points.push(new XYZ(4, 5, 6));
      silhouette.wires.push(wire);
      geometry.silhouettes.push(silhouette);
      if (version >= ACadVersion.AC1021) geometry.materialMappings.push({ arrayIndex: 7, absoluteReference: 11, materialHandle: 0 });
      if (version >= ACadVersion.AC1027) geometry.guid = '{89abcdef-0123-4567-89ab-cdef01234567}';
      document.entities.add(geometry);
    }
    const restored = roundtrip(roundtrip(document));
    for (const [index, actual] of [...restored.entities].entries()) {
      const expected = [...document.entities][index] as ModelerGeometry;
      expect(actual).toBeInstanceOf(expected.constructor);
      const geometry = actual as ModelerGeometry;
      expect(geometry.acisData).toEqual(expected.acisData);
      expect(geometry.modelerDataFlag).toBe(true);
      expect(geometry.secondaryAcisData).toEqual(expected.secondaryAcisData);
      expect(geometry.secondaryModelerDataFlag).toBe(false);
      expect(geometry.secondaryModelerFormatVersion).toBe(1);
      expect(geometry.silhouettes).toEqual(expected.silhouettes);
      expect(geometry.materialMappings).toEqual(expected.materialMappings);
      expect(geometry.guid).toBe(expected.guid);
    }
  });

  it.each([ACadVersion.AC1018, ACadVersion.AC1021, ACadVersion.AC1024, ACadVersion.AC1027, ACadVersion.AC1032])('preserves SAB primary and secondary streams in %s', version => {
    const document = new CadDocument(version);
    for (const Type of [Solid3D, Region, CadBody]) {
      const geometry = new Type();
      geometry.acisData = bytes('ACIS BinaryFile primary End-of-ACIS-data');
      geometry.secondaryAcisData = bytes('ACIS BinaryFile secondary End-of-ACIS-data');
      geometry.modelerDataFlag = false;
      geometry.secondaryModelerDataFlag = true;
      document.entities.add(geometry);
    }
    const restored = roundtrip(roundtrip(document));
    for (const actual of restored.entities) {
      const geometry = actual as ModelerGeometry;
      expect(geometry.acisData).toEqual(bytes('ACIS BinaryFile primary End-of-ACIS-data'));
      expect(geometry.secondaryAcisData).toEqual(bytes('ACIS BinaryFile secondary End-of-ACIS-data'));
      expect(geometry.modelerFormatVersion).toBe(2);
      expect(geometry.secondaryModelerFormatVersion).toBe(2);
      expect(geometry.secondaryModelerDataFlag).toBe(true);
    }
  });

  it.each(versions)('handles unsupported ASM export and explicit legacy preservation in %s', version => {
    const document = new CadDocument(version);
    const geometry = new Region();
    geometry.acisData = bytes('ASM BinaryFile primary End-of-ASM-data');
    geometry.secondaryAcisData = bytes('ASM BinaryFile secondary End-of-ASM-data');
    geometry.point = new XYZ(1, 2, 3);
    document.entities.add(geometry);
    for (const optIn of [false, true]) {
      const config = new DwgWriterConfiguration(); config.writeLegacyAsmData = optIn;
      const messages: string[] = [];
      const actual = [...roundtrip(document, config, messages).entities][0] as Region;
      const supported = version >= ACadVersion.AC1027 || (optIn && version >= ACadVersion.AC1018);
      expect(actual.acisData).toEqual(supported ? geometry.acisData : new Uint8Array());
      expect(actual.secondaryAcisData).toEqual(supported ? geometry.secondaryAcisData : new Uint8Array());
      expect(actual.point).toEqual(geometry.point);
      expect(geometry.acisData.length).toBeGreaterThan(0);
      expect(geometry.secondaryAcisData.length).toBeGreaterThan(0);
      if (version < ACadVersion.AC1027) expect(messages.some(message => message.includes(supported ? 'preserved unchanged' : 'written empty'))).toBe(true);
    }
  });

  it.each([ACadVersion.AC1018, ACadVersion.AC1021, ACadVersion.AC1024, ACadVersion.AC1027, ACadVersion.AC1032])('writes the version-specific silhouette field and following trailer directly in %s', version => {
    const document = new CadDocument(version);
    const geometry = new Region();
    const silhouette = new ModelerGeometrySilhouette();
    silhouette.viewportId = version >= ACadVersion.AC1024 ? 0x123456789 : -2147483648;
    silhouette.viewportTarget = new XYZ(1, 2, 3);
    geometry.silhouettes.push(silhouette);
    const buffer = new Uint8Array(2048);
    const stream = DwgStreamWriterBase.getStreamWriter(version, buffer, 'windows-1252');
    const writer = new DwgObjectWriter(buffer, document, 'windows-1252') as unknown as {
      _writer: IDwgStreamWriter; _writeModelerGeometry(geometry: ModelerGeometry): void;
    };
    writer._writer = stream;
    writer._writeModelerGeometry(geometry);
    const endPosition = stream.positionInBits;
    stream.writeBitLong(12345); // Flush the last partial byte and verify trailer alignment.
    const reader = DwgStreamReaderBase.getStreamHandler(version, buffer);
    expect(reader.readBit()).toBe(true); // Empty primary.
    expect(reader.readBit()).toBe(true); // Wireframe present.
    expect(reader.readBit()).toBe(false); // No point.
    expect(reader.readBitLong()).toBe(0);
    expect(reader.readBit()).toBe(false); // No top-level wires.
    expect(reader.readBitLong()).toBe(1);
    expect(version >= ACadVersion.AC1024 ? reader.readBitLongLong() : reader.readBitLong()).toBe(silhouette.viewportId);
    expect(reader.read3BitDouble()).toEqual(silhouette.viewportTarget);
    expect(reader.read3BitDouble()).toEqual(new XYZ());
    expect(reader.read3BitDouble()).toEqual(new XYZ());
    expect(reader.readBit()).toBe(false);
    expect(reader.readBit()).toBe(false); // Empty nested wires.
    expect(reader.readBit()).toBe(true); // Empty secondary inside wireframe.
    if (version >= ACadVersion.AC1021) expect(reader.readBitLong()).toBe(0);
    if (version >= ACadVersion.AC1027) {
      expect(reader.readBit()).toBe(false);
      expect(reader.readBitLong()).toBe(0);
      expect(reader.readBitShort()).toBe(0);
      expect(reader.readBitShort()).toBe(0);
      expect(reader.readBytes(8)).toEqual(new Uint8Array(8));
      expect(reader.readBitLong()).toBe(0);
    }
    expect(reader.positionInBits()).toBe(endPosition);
    expect(reader.readBitLong()).toBe(12345);
  });

  it('stops binary lookahead at the first marker, including a marker at the last byte', () => {
    const reader = DwgObjectReader as unknown as { _modelerPayloadLength(data: Uint8Array): number };
    const primary = bytes('ASM BinaryFile primary End-of-ASM-data');
    const secondary = bytes('ACIS BinaryFile secondary End-of-ACIS-data');
    expect(reader._modelerPayloadLength(primary)).toBe(primary.length);
    expect(reader._modelerPayloadLength(new Uint8Array([...primary, ...secondary]))).toBe(primary.length);
  });
});
