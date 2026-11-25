import { expect, it } from 'vitest';
import { ACadVersion } from '../../src/ACadVersion.js';
import { CadDocument } from '../../src/CadDocument.js';
import { TableEntity, TableEntityColumn, TableEntityRow, TableEntityCell, CellContent, CellType } from '../../src/Entities/TableEntity.js';
import { BlockRecord } from '../../src/Tables/BlockRecord.js';
import { DxfReader } from '../../src/IO/DXF/DxfReader.js';
import { DxfWriter } from '../../src/IO/DXF/DxfWriter.js';
import { DwgReader } from '../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../src/IO/DWG/DwgWriter.js';
it.each([ACadVersion.AC1018,ACadVersion.AC1032])('resolves table block cells in both file formats (%s)', version => {
  const doc = new CadDocument(version), graphics = new BlockRecord('Table'), content = new BlockRecord('Cell block');
  doc.blockRecords.add(graphics); doc.blockRecords.add(content);
  const table = new TableEntity(graphics), cell = new TableEntityCell(), row = new TableEntityRow();
  cell.type = CellType.Block; cell.blockScale = 2; cell.contents.push(new CellContent(content)); row.cells.push(cell); table.rows.push(row); table.columns.push(new TableEntityColumn()); doc.entities.add(table);
  const bytes = new Uint8Array(1024*1024); new DxfWriter(bytes,doc).write();
  const results = [new DxfReader(bytes).read(),new DwgReader(DwgWriter.writeToBuffer(doc)).read()];
  for (const result of results) {
    const decoded = [...result.entities][0] as TableEntity;
    expect(decoded.rows[0].cells[0].contents.some(value => value.blockRecord === result.blockRecords.get('Cell block'))).toBe(true);
    if (version <= ACadVersion.AC1018 || result === results[0]) expect(decoded.rows[0].cells[0].blockScale).toBe(2);
  }
});
