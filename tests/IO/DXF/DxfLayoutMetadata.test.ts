import { describe, expect, it } from 'vitest';
import { DxfReader } from '../../../src/IO/DXF/DxfReader.js';
import { DxfWriter } from '../../../src/IO/DXF/DxfWriter.js';
import { CellStyleMap } from '../../../src/Objects/CellStyleMap.js';
import { Solid3D } from '../../../src/Entities/Solid3D.js';
import { CadDocument } from '../../../src/CadDocument.js';
import { TextEntity } from '../../../src/Entities/TextEntity.js';
import { Leader } from '../../../src/Entities/Leader.js';
import { Color } from '../../../src/Color.js';
import { TextStyle } from '../../../src/Tables/TextStyle.js';
import { XYZ } from '../../../src/Math/XYZ.js';

function dxf(sections: string): Uint8Array {
  const tables = ['APPID', 'STYLE', 'LTYPE', 'LAYER', 'UCS', 'VIEW', 'BLOCK_RECORD', 'DIMSTYLE', 'VPORT']
    .filter(name => !sections.includes(`0\nTABLE\n2\n${name}\n`))
    .map((name, index) => `0\nTABLE\n2\n${name}\n5\n${(100 + index).toString(16)}\n100\nAcDbSymbolTable\n70\n0\n0\nENDTAB\n`).join('');
  const tableSection = '0\nSECTION\n2\nTABLES\n';
  sections = sections.includes(tableSection) ? sections.replace(tableSection, tableSection + tables) : tableSection + tables + '0\nENDSEC\n' + sections;
  return new TextEncoder().encode(`0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1021\n0\nENDSEC\n${sections}0\nEOF\n`);
}

describe('Layout metadata DXF reading', () => {
  it('resolves text and dimension styles with the same name and preserves leader color overrides', () => {
    const doc = new CadDocument();
    doc.modelSpace!.entities.add(new TextEntity('Conveyor'));
    const leader = new Leader(); leader.vertices = [new XYZ(), new XYZ(5, 5)]; leader.byBlockColor = Color.blue;
    doc.modelSpace!.entities.add(leader);
    const bytes = new Uint8Array(1024 * 1024); new DxfWriter(bytes, doc).write();
    const messages: string[] = [];
    const restored = DxfReader.readFromStream(bytes, (_sender, event) => messages.push(event.message));
    expect(messages).toEqual([]);
    const text = [...restored.modelSpace!.entities].find(entity => entity instanceof TextEntity) as TextEntity;
    const readLeader = [...restored.modelSpace!.entities].find(entity => entity instanceof Leader) as Leader;
    expect(text.style).toBeInstanceOf(TextStyle);
    expect(text.style.name).toBe('Standard');
    expect(readLeader.byBlockColor.getRgb()).toEqual([0, 0, 255]);
  });
  it('reads modeler geometry inheritance, polyface counts, viewport height and named objects without diagnostics', () => {
    const messages: string[] = [];
    const doc = DxfReader.readFromStream(dxf(
      '0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nVPORT\n100\nAcDbSymbolTable\n70\n1\n0\nVPORT\n5\nA\n100\nAcDbSymbolTableRecord\n100\nAcDbViewportTableRecord\n2\n*ACTIVE\n40\n1234.5\n0\nENDTAB\n0\nENDSEC\n'
      + '0\nSECTION\n2\nENTITIES\n0\n3DSOLID\n5\nB\n100\nAcDbEntity\n8\n0\n48\n0.1\n100\nAcDbModelerGeometry\n70\n1\n1\n700 0 0 0\n100\nAcDb3dSolid\n0\nPOLYLINE\n5\nC\n100\nAcDbEntity\n8\n0\n100\nAcDbPolyFaceMesh\n70\n64\n71\n0\n72\n0\n0\nSEQEND\n5\nD\n100\nAcDbEntity\n0\nENDSEC\n'
      + '0\nSECTION\n2\nOBJECTS\n0\nDICTIONARY\n5\n10\n330\n0\n100\nAcDbDictionary\n3\nMaterial\n350\n11\n3\nScale\n350\n12\n0\nMATERIAL\n5\n11\n330\n10\n100\nAcDbMaterial\n1\nByLayer\n0\nSCALE\n5\n12\n330\n10\n100\nAcDbScale\n300\n1:20\n140\n1\n141\n20\n290\n0\n0\nENDSEC\n'
    ), (_sender, event) => messages.push(event.message));
    expect(messages).toEqual([]);
    expect(doc.vPorts?.get('*ACTIVE').viewHeight).toBe(1234.5);
    const solid = [...doc.modelSpace!.entities].find(entity => entity instanceof Solid3D) as Solid3D;
    expect(solid.lineTypeScale).toBe(.1);
    expect(solid.getAcisText()).toContain('700 0 0 0');
    expect(doc.rootDictionary?.get('ByLayer')?.name).toBe('ByLayer');
    expect(doc.rootDictionary?.get('1:20')?.name).toBe('1:20');
  });

  it('retains extension dictionaries across reactor groups and round-trips typed cell styles', () => {
    const messages: string[] = [];
    const bytes = dxf('0\nSECTION\n2\nOBJECTS\n'
      + '0\nDICTIONARY\n5\n10\n330\n0\n100\nAcDbDictionary\n3\nStyle\n350\n11\n'
      + '0\nTABLESTYLE\n5\n11\n102\n{ACAD_XDICTIONARY\n360\n12\n102\n}\n102\n{ACAD_REACTORS\n330\n10\n102\n}\n330\n10\n100\nAcDbTableStyle\n3\nExample\n'
      + '0\nDICTIONARY\n5\n12\n330\n11\n100\nAcDbDictionary\n3\nCellStyles\n360\n13\n'
      + '0\nCELLSTYLEMAP\n5\n13\n330\n12\n100\nAcDbCellStyleMap\n90\n1\n300\nCELLSTYLE\n1\nTABLEFORMAT_BEGIN\n90\n5\n170\n1\n91\n0\n92\n32768\n62\n257\n93\n1\n300\nCONTENTFORMAT\n1\nCONTENTFORMAT_BEGIN\n90\n0\n91\n0\n92\n512\n93\n0\n300\n%lu2\n40\n90\n140\n1\n94\n5\n62\n1\n144\n0.25\n309\nCONTENTFORMAT_END\n171\n0\n94\n0\n309\nTABLEFORMAT_END\n1\nCELLSTYLE_BEGIN\n90\n1\n91\n2\n300\n_TITLE\n309\nCELLSTYLE_END\n0\nENDSEC\n');
    const doc = DxfReader.readFromStream(bytes, (_sender, event) => messages.push(event.message));
    expect(messages).toEqual([]);
    const owner = doc.rootDictionary!.get('Style')!;
    const map = owner.xDictionary!.get('CellStyles') as CellStyleMap;
    expect(map).toBeInstanceOf(CellStyleMap);
    expect(map.cellStyles[0]).toMatchObject({ id: 1, name: '_TITLE', styleClass: 2, alignment: 5, scale: .25, textHeight: 1, valueDataType: 512, valueFormatString: '%lu2' });
    expect(map.cellStyles[0].rotation).toBeCloseTo(Math.PI / 2);
    const output = new Uint8Array(1024 * 1024);
    new DxfWriter(output, doc).write();
    const restored = DxfReader.readFromStream(output);
    const reread = restored.rootDictionary!.get('Style')!.xDictionary!.get('CellStyles') as CellStyleMap;
    expect(reread.cellStyles[0]).toMatchObject({ id: 1, name: '_TITLE', alignment: 5, scale: .25, textHeight: 1, valueFormatString: '%lu2' });
    expect(reread.cellStyles[0].rotation).toBeCloseTo(Math.PI / 2);
  });
});
