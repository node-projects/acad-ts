import { describe, expect, it } from 'vitest';
import { CadDocument } from '../../../src/CadDocument.js';
import { DxfWriter } from '../../../src/IO/DXF/DxfWriter.js';
import { Field } from '../../../src/Objects/Field.js';
import { FieldList } from '../../../src/Objects/FieldList.js';

describe('DXF FIELD ownership', () => {
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
    const chunks: string[] = [];
    const output = { write(value: string) { chunks.push(value); }, flush() {}, close() {} };
    expect(() => new DxfWriter(output, document, false).write()).not.toThrow();
    expect(parent.owner).toBe(existingOwner ? originalOwner : list);
    expect(child.owner).toBe(parent);
    expect(grandchild.owner).toBe(child);
    const fields = chunks.join('').split(/\r?\n/).filter(line => line === 'FIELD');
    expect(fields).toHaveLength(3);
  });
});
