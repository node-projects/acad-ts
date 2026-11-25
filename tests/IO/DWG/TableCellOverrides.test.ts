import { expect, it } from 'vitest';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { CadDocument } from '../../../src/CadDocument.js';
import { TableEntity, TableEntityCell, TableEntityRow, TableEntityColumn, CellContent } from '../../../src/Entities/TableEntity.js';
import { CadValueType } from '../../../src/CadValueType.js';
import { Color } from '../../../src/Color.js';
import { TextStyle } from '../../../src/Tables/TextStyle.js';
import { BlockRecord } from '../../../src/Tables/BlockRecord.js';
import { DwgReader } from '../../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../../src/IO/DWG/DwgWriter.js';
it.each([ACadVersion.AC1018,ACadVersion.AC1021])('round-trips every legacy cell override (%s)', version => {
  const doc = new CadDocument(version), block = new BlockRecord('Table graphics'); doc.blockRecords.add(block);
  const table = new TableEntity(block), cell = new TableEntityCell(), row = new TableEntityRow(), content = new CellContent();
  content.cadValue.setValue('Cell',CadValueType.String); cell.contents.push(content); row.cells.push(cell); table.rows.push(row); table.columns.push(new TableEntityColumn());
  const style = cell.styleOverride; style.overrideFlags = 0x3FFFF; style.cellAlignment = 5; style.isFillColorOn = true; style.backgroundColor = Color.red; style.contentColor = Color.blue;
  style.textHeight = 7; style.textStyle = new TextStyle('Cell text'); cell.virtualEdgeFlag = 5;
  for (const border of [style.topBorder,style.rightBorder,style.bottomBorder,style.leftBorder]) { border.color = Color.green; border.lineWeight = 30; border.isInvisible = true; }
  doc.entities.add(table);
  const result = [...new DwgReader(DwgWriter.writeToBuffer(doc)).read().entities][0] as TableEntity;
  const restored = result.rows[0].cells[0].styleOverride;
  expect(restored.overrideFlags).toBe(style.overrideFlags); expect(restored.textHeight).toBe(7); expect(restored.cellAlignment).toBe(5);
  expect(restored.backgroundColor.getRgb()).toEqual(style.backgroundColor.getRgb()); expect(restored.contentColor.getRgb()).toEqual(style.contentColor.getRgb());
  expect(restored.textStyle?.name).toBe('Cell text'); expect(result.rows[0].cells[0].virtualEdgeFlag).toBe(5);
  for (const border of [restored.topBorder,restored.rightBorder,restored.bottomBorder,restored.leftBorder]) { expect(border.color.getRgb()).toEqual(Color.green.getRgb()); expect(border.lineWeight).toBe(30); expect(border.isInvisible).toBe(true); }
});
