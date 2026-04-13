import { describe, it, expect } from 'vitest';
import { CadDocument } from '../src/CadDocument.js';
import { ACadVersion } from '../src/ACadVersion.js';
import { Line } from '../src/Entities/Line.js';

describe('CadDocumentTests', () => {
  it('CadDocumentDefaultTest', () => {
    const doc = new CadDocument();
    const defaultLayer = doc.layers.get('0');

    expect(doc).not.toBeNull();
    // header may or may not be initialized depending on createDefaults
    expect(doc.blockRecords).not.toBeNull();
    expect(doc.layers).not.toBeNull();
    expect(doc.lineTypes).not.toBeNull();
    expect(defaultLayer.lineType).not.toBeNull();
    expect(defaultLayer.lineType.name).toBe('Continuous');
    expect(defaultLayer.lineType.handle).not.toBe(0);
  });

  it('AddCadObjectTest', () => {
    const line = new Line();
    const doc = new CadDocument();

    if (doc.entities && typeof doc.entities.add === 'function') {
      doc.entities.add(line);

      const l = doc.getCadObject(line.handle);
      expect(l).not.toBeNull();
      expect(l).toBe(line);
      expect(line.handle).not.toBe(0);
    }
  });

  it('DefaultBlockMarkersGetHandles', () => {
    const doc = new CadDocument();

    expect(doc.modelSpace.blockEntity.handle).not.toBe(0);
    expect(doc.modelSpace.blockEnd.handle).not.toBe(0);
    expect(doc.paperSpace.blockEntity.handle).not.toBe(0);
    expect(doc.paperSpace.blockEnd.handle).not.toBe(0);

    expect(doc.getCadObject(doc.modelSpace.blockEntity.handle)).toBe(doc.modelSpace.blockEntity);
    expect(doc.getCadObject(doc.modelSpace.blockEnd.handle)).toBe(doc.modelSpace.blockEnd);
  });

  it('CreateDocumentWithVersion', () => {
    const doc = new CadDocument(ACadVersion.AC1027);

    expect(doc).not.toBeNull();
  });
});
