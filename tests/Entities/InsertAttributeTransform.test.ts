import { describe, expect, it } from 'vitest';
import { AttributeEntity } from '../../src/Entities/AttributeEntity.js';
import { Insert } from '../../src/Entities/Insert.js';
import { XYZ } from '../../src/Math/XYZ.js';
import { CadDocument } from '../../src/CadDocument.js';
import { BlockRecord } from '../../src/Tables/BlockRecord.js';
import { CadInsertTemplate } from '../../src/IO/Templates/CadInsertTemplate.js';
import { CadAttributeTemplate } from '../../src/IO/Templates/CadAttributeTemplate.js';
import { DxfDocumentBuilder } from '../../src/IO/DXF/DxfDocumentBuilder.js';
import { DxfReaderConfiguration } from '../../src/IO/DXF/DxfReaderConfiguration.js';

describe('InsertAttributeTransform', () => {
  it.each(['linked', 'owned'] as const)('preserves stored attribute geometry when loading %s handles', path => {
    const document = new CadDocument();
    const builder = new DxfDocumentBuilder(document.header.version, document, new DxfReaderConfiguration());
    const block = new BlockRecord('ATTRIBUTES');
    builder.blockRecords.add(block);
    const insert = new Insert();
    insert.handle = 100;
    insert.insertPoint = new XYZ(100, 200, 0);
    insert.rotation = Math.PI / 3;
    insert.xScale = 2;
    insert.yScale = 3;
    const template = new CadInsertTemplate(insert);
    template.blockName = block.name;
    const attributes = [new AttributeEntity(), new AttributeEntity()];
    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i];
      attribute.handle = 101 + i;
      attribute.insertPoint = new XYZ(110 + i, 220 + i, 0);
      attribute.alignmentPoint = new XYZ(115 + i, 225 + i, 0);
      attribute.height = 3;
      attribute.widthFactor = 0.8;
      attribute.rotation = Math.PI / 6;
      const attributeTemplate = new CadAttributeTemplate(attribute);
      if (i === 0) attributeTemplate.nextEntity = 102;
      builder.addTemplate(attributeTemplate);
    }
    if (path === 'linked') {
      template.firstAttributeHandle = 101;
      template.endAttributeHandle = 102;
    } else {
      template.ownedObjectsHandlers = new Set([101, 102]);
    }
    template.build(builder);
    expect([...insert.attributes]).toEqual(attributes);
    for (let i = 0; i < attributes.length; i++) {
      const attribute = insert.attributes[i];
      expect(attribute.owner === insert).toBe(true);
      expect(attribute.insertPoint).toEqual(new XYZ(110 + i, 220 + i, 0));
      expect(attribute.alignmentPoint).toEqual(new XYZ(115 + i, 225 + i, 0));
      expect(attribute.height).toBe(3);
      expect(attribute.widthFactor).toBe(0.8);
      expect(attribute.rotation).toBe(Math.PI / 6);
    }
  });

  it('applies the insert scale and translation to attached attributes', () => {
    const insert = new Insert();
    insert.insertPoint = new XYZ(920.6796266627233, 16.35285377389053, 0);
    insert.xScale = 0.36337369484720056;
    insert.yScale = 0.36337369484720056;
    insert.zScale = 0.36337369484720056;

    const attribute = new AttributeEntity();
    attribute.insertPoint = new XYZ(920.6796266627233, 16.35285377389053, 0);
    attribute.alignmentPoint = new XYZ(994.5582906791903, 43.43013871296577, 0);
    attribute.height = 1.8168684742360028;

    insert.applyAttributeTransform(attribute);

    expect(attribute.insertPoint.x).toBeCloseTo(1255.2303843736981);
    expect(attribute.insertPoint.y).toBeCloseTo(22.29505067100512);
    expect(attribute.alignmentPoint.x).toBeCloseTo(994.5582906791903);
    expect(attribute.alignmentPoint.y).toBeCloseTo(43.43013871296577);
    expect(attribute.height).toBeCloseTo(0.6602022105345322);
    expect(attribute.widthFactor).toBeCloseTo(1);
  });
});
