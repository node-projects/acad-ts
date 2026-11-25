import { expect, it } from 'vitest';
import { CadDocument } from '../../../src/CadDocument.js';
import { PlotStyleMode } from '../../../src/Header/PlotStyleMode.js';
import { DwgWriter } from '../../../src/IO/DWG/DwgWriter.js';
import { DwgReader } from '../../../src/IO/DWG/DwgReader.js';
it.each([PlotStyleMode.Named, PlotStyleMode.ColorDependent])('round-trips normalized PSTYLEMODE %s', mode => {
  const doc = new CadDocument(); doc.header.plotStyleMode = mode;
  expect(new DwgReader(DwgWriter.writeToBuffer(doc)).read().header.plotStyleMode).toBe(mode);
});
