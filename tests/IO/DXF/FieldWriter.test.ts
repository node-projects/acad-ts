import { describe, expect, it } from 'vitest';
import { CadDocument } from '../../../src/CadDocument.js';
import { DxfWriter } from '../../../src/IO/DXF/DxfWriter.js';
import { Field } from '../../../src/Objects/Field.js';
import { FieldList } from '../../../src/Objects/FieldList.js';

function writeFields(document: CadDocument) {
  const chunks: string[] = [];
  new DxfWriter({ write(value: string) { chunks.push(value); } }, document).write();
  const lines = chunks.join('').trimEnd().split(/\r?\n/);
  const pairs = [] as { code: number; value: string }[];
  for (let i = 0; i < lines.length; i += 2) pairs.push({ code: Number(lines[i]), value: lines[i + 1] });
  const records = new Map<number, typeof pairs>();
  for (let i = 0; i < pairs.length; i++) {
    if (pairs[i].code !== 0 || pairs[i].value !== 'FIELD') continue;
    let end = i + 1;
    while (end < pairs.length && pairs[end].code !== 0) end++;
    const record = pairs.slice(i + 1, end);
    records.set(parseInt(record.find(pair => pair.code === 5)!.value, 16), record);
  }
  const seedIndex = pairs.findIndex(pair => pair.code === 9 && pair.value === '$HANDSEED');
  return { records, seed: parseInt(pairs[seedIndex + 1].value, 16) };
}

describe('DXF FIELD ownership', () => {
  it.each(['dictionary', 'list'] as const)('allocates nested field handles before HANDSEED (%s root)', root => {
    const document = new CadDocument();
    const parent = new Field();
    if (root === 'dictionary') {
      parent.name = 'PARENT';
      document.rootDictionary!.add(parent);
    } else {
      const list = new FieldList();
      list.name = 'ACAD_FIELDLIST';
      document.rootDictionary!.add(list);
      list.fields.push(parent);
    }
    const child = new Field(), grandchild = new Field();
    parent.children.push(child);
    child.children.push(grandchild);
    const { records, seed } = writeFields(document);
    expect(records.size).toBe(3);
    for (const field of [parent, child, grandchild]) {
      expect(field.handle).toBeGreaterThan(0);
      expect(field.handle).toBeLessThan(seed);
      expect(document.getCadObject(field.handle)).toBe(field);
      expect(records.get(field.handle)!.find(pair => pair.code === 330)?.value).toBe(field.owner!.handle.toString(16).toUpperCase());
    }
    expect(records.get(parent.handle)).toContainEqual({ code: 360, value: child.handle.toString(16).toUpperCase() });
    expect(records.get(child.handle)).toContainEqual({ code: 360, value: grandchild.handle.toString(16).toUpperCase() });
    expect(writeFields(document).records.size).toBe(3);
  });

  it.each([false, true])('resolves hard child owners before list fallbacks (child first: %s)', childFirst => {
    const document = new CadDocument();
    const list = new FieldList();
    list.name = 'ACAD_FIELDLIST';
    document.rootDictionary!.add(list);
    const parent = new Field(), child = new Field();
    parent.handle = 10000;
    child.handle = 10001;
    parent.children.push(child);
    list.fields.push(...(childFirst ? [child, parent] : [parent, child]));
    const { records, seed } = writeFields(document);
    expect(parent.owner).toBe(list);
    expect(child.owner).toBe(parent);
    expect(records.size).toBe(2);
    expect(records.get(child.handle)!.find(pair => pair.code === 330)?.value).toBe(parent.handle.toString(16).toUpperCase());
    expect(seed).toBeGreaterThan(child.handle);
  });

  it('preserves existing child ownership', () => {
    const document = new CadDocument();
    const parent = new Field(), child = new Field();
    parent.name = 'PARENT';
    child.name = 'CHILD';
    document.rootDictionary!.add(parent);
    document.rootDictionary!.add(child);
    parent.children.push(child);
    expect(writeFields(document).records.size).toBe(2);
    expect(child.owner).toBe(document.rootDictionary);
  });

  it.each([false, true])('writes orphan fields and nested children (existing owner: %s)', existingOwner => {
    const document = new CadDocument();
    const list = new FieldList();
    list.name = 'ACAD_FIELDLIST';
    document.rootDictionary!.add(list);
    const parent = new Field();
    parent.handle = 10000;
    const child = new Field();
    child.handle = 10001;
    const grandchild = new Field();
    grandchild.handle = 10002;
    list.fields.push(parent);
    parent.children.push(child);
    child.children.push(grandchild);
    if (existingOwner) parent.owner = document.rootDictionary;
    const originalOwner = parent.owner;
    const { records } = writeFields(document);
    expect(parent.owner).toBe(existingOwner ? originalOwner : list);
    expect(child.owner).toBe(parent);
    expect(grandchild.owner).toBe(child);
    expect(records.size).toBe(3);
  });
});
