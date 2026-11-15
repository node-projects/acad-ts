import { expect, it } from 'vitest';
import { CadDocument } from '../../../src/CadDocument.js';
import { TableStyle } from '../../../src/Objects/TableStyle.js';
import { CellStyle, TableEntity } from '../../../src/Entities/TableEntity.js';
import { LineType } from '../../../src/Tables/LineType.js';
import { TextStyle } from '../../../src/Tables/TextStyle.js';
import { DwgWriter } from '../../../src/IO/DWG/DwgWriter.js';
import { DwgReader } from '../../../src/IO/DWG/DwgReader.js';

it('round-trips canonical and custom table styles with document-owned references', () => {
  const doc = new CadDocument(), style = new TableStyle('Custom table');
  const custom = new CellStyle(); custom.name = 'Special'; custom.id = 99;
  custom.textStyle = new TextStyle('Custom text'); custom.topBorder.lineType = new LineType('Custom border');
  style.cellStyles.push(custom); doc.tableStyles!.add(style);
  const table = new TableEntity(); table.content.style = style; doc.entities.add(table);
  expect(custom.textStyle).toBe(doc.textStyles.get('Custom text'));
  expect(custom.topBorder.lineType).toBe(doc.lineTypes.get('Custom border'));
  const buffer = new ArrayBuffer(1024 * 1024), writer = new DwgWriter(buffer, doc); writer.write();
  const decoded = new DwgReader(buffer.slice(0, writer.bytesWritten)).read();
  const readStyle = decoded.tableStyles!.get('Custom table');
  expect(readStyle.cellStyles).toHaveLength(1);
  expect(readStyle.cellStyles[0].name).toBe('Special');
  expect(readStyle.cellStyles[0].textStyle).toBe(decoded.textStyles.get('Custom text'));
  expect(readStyle.cellStyles[0].topBorder.lineType).toBe(decoded.lineTypes.get('Custom border'));
  expect(readStyle.titleCellStyle.owner).toBe(readStyle);
});
