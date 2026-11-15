import { expect, it } from 'vitest';
import { TableEntity, TableEntityRow, TableEntityColumn, TableEntityCell, CellContent, BreakHeight, CellStyle } from '../src/Entities/TableEntity.js';
import { CadValue } from '../src/CadValue.js';
import { Line } from '../src/Entities/Line.js';

it('deep-clones table components and clears handled CAD values', () => {
  const table = new TableEntity(), row = new TableEntityRow(), cell = new TableEntityCell(), content = new CellContent();
  content.cadValue.value = new Uint8Array([1, 2]);
  cell.contents.push(content); row.cells.push(cell); table.rows.push(row);
  const clone = row.clone();
  expect(clone.owner).toBeNull();
  expect(clone.cells[0]).not.toBe(cell);
  expect(clone.cells[0].contents[0].cadValue.value).toEqual(content.cadValue.value);
  (clone.cells[0].contents[0].cadValue.value as Uint8Array)[0] = 7;
  expect((content.cadValue.value as Uint8Array)[0]).toBe(1);
  clone.cells[0].styleOverride.topBorder.isInvisible = true;
  expect(cell.styleOverride.topBorder.isInvisible).toBe(false);
  const value = new CadValue(); value.value = new Line();
  expect(value.clone().value).toBeNull();
});

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
