import { expect, it } from 'vitest';
import { CadDocument } from '../../../src/CadDocument.js';
import { Insert } from '../../../src/Entities/Insert.js';
import { BlockRecord } from '../../../src/Tables/BlockRecord.js';
import { PlotStyleType } from '../../../src/Entities/PlotStyleType.js';
import { DxfReader } from '../../../src/IO/DXF/DxfReader.js';
import { DxfWriter } from '../../../src/IO/DXF/DxfWriter.js';

it('reads MINSERT fields and common plot style assignment', () => {
  const doc = new CadDocument(), block = new BlockRecord('Pattern'); doc.blockRecords.add(block);
  const insert = new Insert(block); insert.rowCount = 3; insert.columnCount = 2;
  insert.rowSpacing = 10; insert.columnSpacing = 20; insert.plotStyle = PlotStyleType.ByBlock;
  doc.entities.add(insert);
  const chunks: string[] = [];
  new DxfWriter({ write: (value: string) => chunks.push(value), flush() {}, close() {} }, doc, false).write();
  const input = chunks.join('').replace('AcDbBlockReference', 'AcDbMInsertBlock');
  const decoded = [...new DxfReader(new TextEncoder().encode(input)).read().entities][0] as Insert;
  expect(decoded.rowCount).toBe(3); expect(decoded.columnCount).toBe(2);
  expect(decoded.rowSpacing).toBe(10); expect(decoded.columnSpacing).toBe(20);
  expect(decoded.plotStyle).toBe(PlotStyleType.ByBlock);
});
