import { expect, it } from 'vitest';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { CadDocument } from '../../../src/CadDocument.js';
import { TableEntity, TableEntityColumn, TableEntityRow, TableEntityCell, CellContent, CellOverrideFlags } from '../../../src/Entities/TableEntity.js';
import { CadValueType } from '../../../src/CadValueType.js';
import { BlockRecord } from '../../../src/Tables/BlockRecord.js';
import { DxfReader } from '../../../src/IO/DXF/DxfReader.js';
import { DxfWriter } from '../../../src/IO/DXF/DxfWriter.js';

it('preserves an empty typed point without modifying the source value', () => {
  const doc = new CadDocument(), block = new BlockRecord('Empty cell graphics'); doc.blockRecords.add(block);
  const table = new TableEntity(block), cell = new TableEntityCell(), row = new TableEntityRow(), content = new CellContent();
  content.cadValue.valueType = CadValueType.Point3D; cell.contents.push(content); row.cells.push(cell); table.rows.push(row); table.columns.push(new TableEntityColumn()); doc.entities.add(table);
  for (const binary of [false,true]) {
    const bytes = new Uint8Array(1024*1024); new DxfWriter(bytes,doc,binary).write();
    const restored = [...new DxfReader(bytes).read().entities][0] as TableEntity;
    expect(restored.rows[0].cells[0].content?.cadValue.valueType).toBe(CadValueType.Point3D);
    expect(restored.rows[0].cells[0].content?.cadValue.value).toBeNull();
    expect(restored.rows[0].cells[0].content?.cadValue.isEmpty).toBe(true);
  }
  expect(content.cadValue.flags).toBe(0);
});

it.each([ACadVersion.AC1018,ACadVersion.AC1032])('round-trips DXF table dimensions, long text, rotation and overrides (%s)', version => {
  const doc = new CadDocument(version), block = new BlockRecord('Table graphics'); doc.blockRecords.add(block);
  const table = new TableEntity(block), column = new TableEntityColumn(), row = new TableEntityRow(), cell = new TableEntityCell();
  const content = new CellContent(); content.cadValue.setValue('A long table cell '.repeat(60),CadValueType.String); cell.contents.push(content);
  cell.rotation = Math.PI/3; cell.styleOverride.overrideFlags = CellOverrideFlags.TextHeight | CellOverrideFlags.LeftVisibility;
  row.height = 12; column.width = 30; row.cells.push(cell); table.rows.push(row); table.columns.push(column); doc.entities.add(table);
  for (const binary of [false,true]) {
    const data = new Uint8Array(1024*1024); new DxfWriter(data,doc,binary).write();
    const decoded = [...new DxfReader(data).read().entities][0] as TableEntity;
    expect(decoded).toBeInstanceOf(TableEntity); expect(decoded.rows[0].height).toBe(12); expect(decoded.columns[0].width).toBe(30);
    expect(decoded.rows[0].cells[0].rotation).toBeCloseTo(cell.rotation,12);
    expect(decoded.rows[0].cells[0].content?.cadValue.value).toBe(content.cadValue.value);
    expect(decoded.rows[0].cells[0].styleOverride.overrideFlags).toBe(version <= ACadVersion.AC1018 ? CellOverrideFlags.TextHeight : cell.styleOverride.overrideFlags);
  }
});
