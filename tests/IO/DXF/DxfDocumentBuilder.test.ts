import { describe, expect, it } from 'vitest';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { Block } from '../../../src/Blocks/Block.js';
import { CadDocument } from '../../../src/CadDocument.js';
import { Line } from '../../../src/Entities/Line.js';
import { DxfDocumentBuilder } from '../../../src/IO/DXF/DxfDocumentBuilder.js';
import { DxfReaderConfiguration } from '../../../src/IO/DXF/DxfReaderConfiguration.js';
import { CadBlockEntityTemplate } from '../../../src/IO/Templates/CadBlockEntityTemplate.js';
import { CadEntityTemplate } from '../../../src/IO/Templates/CadEntityTemplate.js';

describe('DxfDocumentBuilder', () => {
  it('assigns orphan entities to owner templates discovered later', () => {
    const builder = new DxfDocumentBuilder(
      ACadVersion.AC1027,
      new CadDocument(ACadVersion.AC1027, false),
      new DxfReaderConfiguration(),
    );
    const owner = new CadBlockEntityTemplate(new Block());
    const child = new CadEntityTemplate(new Line());
    owner.cadObject.handle = 10;
    child.cadObject.handle = 11;
    child.ownerHandle = owner.cadObject.handle;
    builder.addTemplate(owner);
    builder.addTemplate(child);

    (builder as unknown as { _assignOwner(template: CadEntityTemplate): void })._assignOwner(child);

    expect(owner.ownedObjectsHandlers).toContain(child.cadObject.handle);
  });
});
