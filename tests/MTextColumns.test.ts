import { expect, it } from 'vitest';
import { MText, TextColumnData } from '../src/Entities/MText.js';
import { ColumnType } from '../src/Entities/ColumnType.js';
import { CadDocument } from '../src/CadDocument.js';
import { DwgWriter } from '../src/IO/DWG/DwgWriter.js';
import { DwgReader } from '../src/IO/DWG/DwgReader.js';

it('derives the column count from independently cloned heights and round-trips dynamic columns', () => {
  const columns = new TextColumnData(); columns.columnType = ColumnType.StaticColumns;
  columns.width = 12; columns.gutter = 2; columns.heights.push(20, 25, 30);
  expect(columns.columnCount).toBe(3);
  const clone = columns.clone(); clone.heights.pop(); expect(clone.columnCount).toBe(2); expect(columns.columnCount).toBe(3);
  const doc = new CadDocument(), text = new MText(); text.value = 'Columns'; text.columnData = columns.clone(); text.columnData.columnType = ColumnType.DynamicColumns; doc.entities.add(text);
  const restored = new DwgReader(DwgWriter.writeToBuffer(doc)).read();
  expect(([...restored.entities][0] as MText).columnData.heights).toEqual(columns.heights);
});
