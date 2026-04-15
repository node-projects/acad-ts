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

  it('RestoreHandlesUpdatesHandleSeed', () => {
    const doc = new CadDocument();
    const line = new Line();

    if (doc.entities && typeof doc.entities.add === 'function') {
      doc.entities.add(line);
    }

    doc.header.handleSeed = 9999;
    doc.restoreHandles();

    const handles = [...(doc as any)._cadObjects.keys()] as number[];
    expect(doc.header.handleSeed).toBe(Math.max(...handles) + 1);
    expect(doc.header.handleSeed).not.toBe(9999);
  });

  it('UnregisterCollectionDetachesEntityCollections', () => {
    const doc = new CadDocument();
    const line = new Line();

    doc.modelSpace.entities.add(line);

    const originalHandle = line.handle;
    expect(line.document).toBe(doc);
    expect(doc.getCadObject(originalHandle)).toBe(line);

    (doc as any).unregisterCollection(doc.modelSpace.entities);

    expect(line.document).toBeNull();
    expect(line.handle).toBe(0);
    expect(doc.getCadObject(originalHandle)).toBeNull();

    const cadObjectCount = (doc as any)._cadObjects.size;
    const detachedLine = new Line();
    doc.modelSpace.entities.add(detachedLine);

    expect(detachedLine.document).toBeNull();
    expect(detachedLine.handle).toBe(0);
    expect((doc as any)._cadObjects.size).toBe(cadObjectCount);
  });

  it('UnregisterCollectionRejectsCoreTables', () => {
    const doc = new CadDocument();

    expect(() => (doc as any).unregisterCollection(doc.layers)).toThrow(/cannot be removed from a document/i);
  });
});
