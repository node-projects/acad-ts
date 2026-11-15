import { expect, it } from 'vitest';
import { TableEntity, TableEntityRow, TableEntityColumn, TableEntityCell, CellContent } from '../src/Entities/TableEntity.js';

it('propagates table ownership and rejects shared rows, cells and contents', () => {
  const table = new TableEntity(), other = new TableEntity();
  const row = new TableEntityRow(), cell = new TableEntityCell(), content = new CellContent();
  cell.contents.push(content); row.cells.push(cell); table.rows.push(row);
  expect(row.owner).toBe(table.content);
  expect(cell.owner).toBe(table.content);
  expect(content.owner).toBe(table.content);
  expect(content.format.owner).toBe(table.content);
  expect(() => other.rows.push(row)).toThrow(/already belongs/);
  const anotherRow = new TableEntityRow(); other.rows.push(anotherRow);
  expect(() => anotherRow.cells.push(cell)).toThrow(/already belongs/);
  const anotherCell = new TableEntityCell(); anotherRow.cells.push(anotherCell);
  expect(() => anotherCell.contents.push(content)).toThrow(/already belongs/);
  table.rows.length = 0;
  expect(row.owner).toBeNull(); expect(cell.owner).toBeNull(); expect(content.owner).toBeNull();
  other.rows.push(row);
  expect(row.owner).toBe(other.content);
});

it('handles indexed replacement and column removal atomically', () => {
  const table = new TableEntity();
  const first = new TableEntityColumn(), second = new TableEntityColumn();
  table.columns.push(first); table.columns[0] = second;
  expect(first.owner).toBeNull(); expect(second.owner).toBe(table.content);
  expect(table.columns.splice(0, 1)).toEqual([second]);
  expect(second.owner).toBeNull();
});
