import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { CadDocument } from '../../../src/CadDocument.js';
import { TextEntity } from '../../../src/Entities/TextEntity.js';
import { MText } from '../../../src/Entities/MText.js';
import { DxfReader } from '../../../src/IO/DXF/DxfReader.js';
import { DxfWriter } from '../../../src/IO/DXF/DxfWriter.js';
import { DxfBinaryReader } from '../../../src/IO/DXF/DxfStreamReader/DxfBinaryReader.js';
import { encodeCadString } from '../../../src/IO/TextEncoding.js';

const modernVersions = [ACadVersion.AC1021, ACadVersion.AC1024, ACadVersion.AC1027, ACadVersion.AC1032];
const unicodeText = 'Straße €5 ∅45,6 日本語';

// Encode fixtures independently of DxfWriter so matching reader/writer bugs cannot pass.
function fixture(version: ACadVersion, binary: boolean, codePageFirst: boolean): Uint8Array {
  const modern = version >= ACadVersion.AC1021;
  const text = modern ? unicodeText : 'Straße €5';
  const versionPairs: [number, string][] = [[9, '$ACADVER'], [1, ACadVersion[version]]];
  const codePagePairs: [number, string][] = [[9, '$DWGCODEPAGE'], [3, 'ANSI_1252']];
  const pairs: [number, string | number][] = [
    [0, 'SECTION'], [2, 'HEADER'],
    ...(codePageFirst ? [...codePagePairs, ...versionPairs] : [...versionPairs, ...codePagePairs]),
    [9, '$LASTSAVEDBY'], [1, text],
    [0, 'ENDSEC'], [0, 'SECTION'], [2, 'ENTITIES'],
    [0, 'TEXT'], [5, '100'], [100, 'AcDbEntity'], [8, '0'], [100, 'AcDbText'],
    [10, 0], [20, 0], [30, 0], [40, 1], [1, text], [100, 'AcDbText'],
    [0, 'ENDSEC'], [0, 'EOF'],
  ];
  const encoding = modern ? 'utf-8' : 'ANSI_1252';
  if (!binary) {
    return encodeCadString(pairs.flat().join('\n') + '\n', encoding);
  }
  const bytes = Array.from(DxfBinaryReader.sentinelBytes);
  for (const [code, value] of pairs) {
    bytes.push(code & 0xff, code >> 8);
    if (typeof value === 'string') {
      bytes.push(...encodeCadString(value, encoding), 0);
    } else {
      const double = new Uint8Array(8);
      new DataView(double.buffer).setFloat64(0, value, true);
      bytes.push(...double);
    }
  }
  return Uint8Array.from(bytes);
}

describe.each([false, true])('DXF encoding (binary=%s)', binary => {
  describe.each([ACadVersion.AC1018, ...modernVersions])('version %s', version => {
    const modern = version >= ACadVersion.AC1021;
    const text = modern ? unicodeText : 'Straße €5';

    it.each([false, true])('reads independently encoded text (code page first=%s)', codePageFirst => {
      const data = fixture(version, binary, codePageFirst);
      const reader = new DxfReader(data);
      reader.configuration.failsafe = false;
      const document = reader.read();
      expect(document.header.lastSavedBy).toBe(text);
      expect(document.header.codePage).toBe('ANSI_1252');
      expect([...document.entities].filter(e => e instanceof TextEntity).map(e => e.value)).toEqual([text]);

      // These entry points rely on the initial header scan rather than a full read.
      const header = new DxfReader(data).readHeader();
      expect(header.lastSavedBy).toBe(text);
      expect(new DxfReader(data).readEntitiesOnly().map(e => (e as TextEntity).value)).toEqual([text]);
    });

    it('writes the required bytes and roundtrips text', () => {
      const document = new CadDocument(version);
      document.header.codePage = 'ANSI_1252';
      document.modelSpace.entities.add(new TextEntity(text));
      const output = new Uint8Array(1024 * 1024);
      new DxfWriter(output, document, binary).write();

      const expected = modern ? new TextEncoder().encode(text) : encodeCadString(text, 'ANSI_1252');
      expect(Buffer.from(output).includes(expected)).toBe(true);
      if (!binary && modern) {
        expect(Array.from(output.subarray(0, 3))).not.toEqual([0xef, 0xbb, 0xbf]);
      }
      const reread = DxfReader.readFromStream(output);
      expect(reread.header.codePage).toBe('ANSI_1252');
      expect([...reread.entities].filter(e => e instanceof TextEntity).map(e => e.value)).toEqual([text]);
    });
  });

  it.each(modernVersions)('reads Unicode MTEXT from the supplied sample for version %s', version => {
    const data = readFileSync(`samples/sample_${ACadVersion[version]}_${binary ? 'binary' : 'ascii'}.dxf`);
    const document = DxfReader.readFromStream(data);
    const texts = [...document.blockRecords].flatMap(block => [...block.entities])
      .filter(e => e instanceof MText).map(e => e.value);
    expect(texts).toContain('∅45,6');
  });
});
