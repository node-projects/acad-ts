import { expect, it } from 'vitest';
import { ACadVersion, CadDocument, Color, DwgReader, DwgWriter, DxfReader, DxfWriter, Line, TextEntity, XYZ } from '../../src/index.js';

it.each([ACadVersion.AC1018, ACadVersion.AC1021, ACadVersion.AC1027])('preserves asymmetric true colors in DWG version %s', version => {
  const document = new CadDocument(version);
  document.layers.get('0').color = new Color(210, 80, 30);
  for (const rgb of [[255, 255, 255], [0, 0, 0], [220, 40, 15]]) {
    const line = new Line(new XYZ(), new XYZ(10, 10)); line.color = new Color(rgb[0], rgb[1], rgb[2]);
    document.modelSpace!.entities.add(line);
  }
  const reopened = DwgReader.readFromStream(DwgWriter.writeToBuffer(document).buffer);
  expect(Array.from(reopened.modelSpace!.entities, entity => entity.color.getRgb())).toEqual([[255, 255, 255], [0, 0, 0], [220, 40, 15]]);
  expect(reopened.layers.get('0').color.getRgb()).toEqual([210, 80, 30]);
});

it('decodes DXF Unicode escapes for symbols and private-use glyphs', () => {
  const document = new CadDocument(ACadVersion.AC1018);
  const text = new TextEntity('Lagerh\\U+00E4user \\U+2192 \\U+2212 \\U+F078'); document.modelSpace!.entities.add(text);
  const bytes = new Uint8Array(1024 * 1024); new DxfWriter(bytes, document).write();
  const reopened = DxfReader.readFromStream(bytes);
  expect((Array.from(reopened.modelSpace!.entities)[0] as TextEntity).value).toBe('Lagerhäuser → − \uF078');
});
