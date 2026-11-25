import { expect, it } from 'vitest';
import { CadDocument } from '../../../src/CadDocument.js';
import { VisualStyle } from '../../../src/Objects/VisualStyle.js';
import { CadDictionary } from '../../../src/Objects/CadDictionary.js';
import { Color } from '../../../src/Color.js';
import { DwgReader } from '../../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../../src/IO/DWG/DwgWriter.js';
it('exposes named visual effects while retaining their original operation codes', () => {
  const doc = new CadDocument(), style = new VisualStyle('Effects');
  style.drawOrderEnabled = true; style.pencilAngle = .3; style.pencilColor = Color.blue;
  style.edgeTexturePath = 'textures/paper.png'; style.focusWidth = 15;
  style.dwgExtendedProperties[0].operation = 7;
  const dictionary = doc.rootDictionary!.getEntry<CadDictionary>(CadDictionary.acadVisualStyle)!; dictionary.add(style);
  const clone = style.clone(); clone.focusWidth = 25; expect(style.focusWidth).toBe(15);
  const restored = new DwgReader(DwgWriter.writeToBuffer(doc)).read();
  const result = restored.rootDictionary!.getEntry<CadDictionary>(CadDictionary.acadVisualStyle)!.get('Effects') as VisualStyle;
  expect(result.drawOrderEnabled).toBe(true); expect(result.pencilAngle).toBe(.3); expect(result.pencilColor.getRgb()).toEqual(Color.blue.getRgb());
  expect(result.edgeTexturePath).toBe(style.edgeTexturePath); expect(result.focusWidth).toBe(15); expect(result.dwgExtendedProperties[0].operation).toBe(7);
});
