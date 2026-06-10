import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import { TestVariables } from '../TestVariables.js';
import { getDwgFiles, getDxfAsciiFiles, getDxfBinaryFiles, readFileAsArrayBuffer, readFileAsUint8Array } from '../testHelpers.js';
import { DxfReader } from '../../src/IO/DXF/DxfReader.js';
import { DxfWriter } from '../../src/IO/DXF/DxfWriter.js';
import { DwgReader } from '../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../src/IO/DWG/DwgWriter.js';
import { ACadVersion } from '../../src/ACadVersion.js';
import { CadDocument } from '../../src/CadDocument.js';
import { Dimension } from '../../src/Entities/Dimension.js';
import { Mesh } from '../../src/Entities/Mesh.js';
import { MultiLeader } from '../../src/Entities/MultiLeader.js';
import { PdfUnderlay } from '../../src/Entities/PdfUnderlay.js';
import { RasterImage } from '../../src/Entities/RasterImage.js';
import { Wipeout } from '../../src/Entities/Wipeout.js';
import { Solid3D } from '../../src/Entities/Solid3D.js';
import { Region } from '../../src/Entities/Region.js';
import { TableEntity } from '../../src/Entities/TableEntity.js';
import { Wall } from '../../src/Entities/AecObjects/Wall.js';
import { BlockRepresentationData } from '../../src/Objects/BlockRepresentationData.js';
import { DimensionAssociation } from '../../src/Objects/DimensionAssociation.js';
import { EvaluationGraph } from '../../src/Objects/Evaluations/EvaluationGraph.js';
import { Material } from '../../src/Objects/Material.js';
import { TableStyle } from '../../src/Objects/TableStyle.js';
import { VisualStyle } from '../../src/Objects/VisualStyle.js';
import { Layout } from '../../src/Objects/Layout.js';

const roundtripOutDir = path.join(TestVariables.outputSamplesFolder, 'roundtrip');
if (!fs.existsSync(roundtripOutDir)) {
  fs.mkdirSync(roundtripOutDir, { recursive: true });
}

const dwgFiles = getDwgFiles();
const dxfAsciiFiles = getDxfAsciiFiles();
const dxfBinaryFiles = getDxfBinaryFiles();

class InMemoryAsciiStream {
  private readonly chunks: string[] = [];

  public write(value: string): void {
    this.chunks.push(value);
  }

  public flush(): void {}
  public close(): void {}

  public toUint8Array(): Uint8Array {
    return new TextEncoder().encode(this.chunks.join(''));
  }
}

class InMemoryBinaryStream {
  private readonly chunks: Uint8Array[] = [];

  public write(value: Uint8Array): void {
    this.chunks.push(new Uint8Array(value));
  }

  public flush(): void {}
  public close(): void {}

  public toUint8Array(): Uint8Array {
    let total = 0;
    for (const c of this.chunks) total += c.length;
    const merged = new Uint8Array(total);
    let offset = 0;
    for (const c of this.chunks) {
      merged.set(c, offset);
      offset += c.length;
    }
    return merged;
  }
}

function assertDocumentDefaults(doc: CadDocument): void {
  expect(doc).not.toBeNull();
  expect(doc.blockRecords).not.toBeNull();
  expect(doc.layers).not.toBeNull();
  expect(doc.lineTypes).not.toBeNull();
}

describe('Roundtrip Tests', () => {
  describe('DWG Roundtrip', () => {
    it.skip('preserves AC1018 image, underlay, and mesh entities on roundtrip', () => {
      // TODO
      const sample = dwgFiles.find(f => f.fileName === 'sample_AC1018.dwg');
      expect(sample).toBeDefined();

      const data = readFileAsArrayBuffer(sample!.path);
      const doc = new DwgReader(data).read();

      const buffer = new ArrayBuffer(16 * 1024 * 1024);
      const writer = new DwgWriter(buffer, doc);
      writer.write();

      const outPath = path.join(roundtripOutDir, 'rt_sample_AC1018.dwg');
      fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

      const rereadData = readFileAsArrayBuffer(outPath);
      const notifications: string[] = [];
      const reread = new DwgReader(rereadData);
      reread.onNotification = (_sender, e) => notifications.push(e.message);
      const doc2 = reread.read();
      const entities = [...doc2.entities];

      expect(entities.length).toBeGreaterThanOrEqual(142);
      expect(entities.filter(e => e instanceof Mesh)).toHaveLength(2);
      expect(entities.filter(e => e instanceof PdfUnderlay)).toHaveLength(1);
      expect(entities.filter(e => e instanceof RasterImage)).toHaveLength(1);
      expect(entities.filter(e => e instanceof Wipeout)).toHaveLength(1);
      expect(
        notifications.filter(m => /ACAD_IMAGE_VARS|ACAD_IMAGE_DICT|ACAD_PDFDEFINITIONS|2243|2244|3334/i.test(m)),
      ).toHaveLength(0);
    });

    it('preserves AC1018 table-style XRecord handles and skips the model *Active VPort on roundtrip', () => {
      const sample = dwgFiles.find(f => f.fileName === 'sample_AC1018.dwg');
      expect(sample).toBeDefined();

      const data = readFileAsArrayBuffer(sample!.path);
      const doc = new DwgReader(data).read();

      expect(doc.getCadObject(135)).toBeInstanceOf(TableStyle);

      const buffer = new ArrayBuffer(16 * 1024 * 1024);
      const writer = new DwgWriter(buffer, doc);
      writer.write();

      const outPath = path.join(roundtripOutDir, 'rt_sample_AC1018_table-style-layout.dwg');
      fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

      const rereadData = readFileAsArrayBuffer(outPath);
      const reread = new DwgReader(rereadData);
      const doc2 = reread.read();
      const xrecordTemplate = (reread as any)._builder.getObjectTemplate(3966) as { _entries: Array<[number, number]> };

      expect(xrecordTemplate._entries).toContainEqual([330, 135]);

      const modelLayout = doc2.getCadObject(34) as Layout;
      expect(modelLayout.lastActiveViewport).toBeNull();
    });

    it('reads AC1018 table cell contents before roundtrip', () => {
      const sample = dwgFiles.find(f => f.fileName === 'sample_AC1018.dwg');
      expect(sample).toBeDefined();

      const data = readFileAsArrayBuffer(sample!.path);
      const doc = new DwgReader(data).read();
      const tables = [...doc.entities].filter((entity): entity is TableEntity => entity instanceof TableEntity);
      const contentCount = tables.reduce(
        (sum, table) => sum + table.rows.reduce((rowSum, row) => rowSum + row.cells.reduce((cellSum, cell) => cellSum + cell.contents.length, 0), 0),
        0,
      );

      expect(tables).toHaveLength(2);
      expect(contentCount).toBeGreaterThan(0);
    });

    it('preserves AC1018 tables on roundtrip', () => {
      const sample = dwgFiles.find(f => f.fileName === 'sample_AC1018.dwg');
      expect(sample).toBeDefined();

      const doc = new DwgReader(readFileAsArrayBuffer(sample!.path)).read();
      const tables = [...doc.entities].filter((entity): entity is TableEntity => entity instanceof TableEntity);
      const sourceTexts = tables
        .flatMap(table => table.rows.flatMap(row => row.cells))
        .map(cell => cell.content?.cadValue.value)
        .filter((value): value is string => typeof value === 'string' && value.length > 0)
        .slice(0, 5);

      expect(tables).toHaveLength(2);
      expect(sourceTexts.length).toBeGreaterThan(0);

      const buffer = new ArrayBuffer(16 * 1024 * 1024);
      const writer = new DwgWriter(buffer, doc);
      writer.write();

      const outPath = path.join(roundtripOutDir, 'rt_sample_AC1018_tables.dwg');
      fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

      const reread = new DwgReader(readFileAsArrayBuffer(outPath)).read();
      const rereadTables = [...reread.entities].filter((entity): entity is TableEntity => entity instanceof TableEntity);
      const rereadTexts = rereadTables
        .flatMap(table => table.rows.flatMap(row => row.cells))
        .map(cell => cell.content?.cadValue.value)
        .filter((value): value is string => typeof value === 'string' && value.length > 0);

      expect(rereadTables).toHaveLength(tables.length);
      for (const text of sourceTexts) {
        expect(rereadTexts).toContain(text);
      }
    });

    it('resolves AC1018 dynamic block sources before roundtrip', () => {
      const sample = dwgFiles.find(f => f.fileName === 'sample_AC1018.dwg');
      expect(sample).toBeDefined();

      const data = readFileAsArrayBuffer(sample!.path);
      const doc = new DwgReader(data).read();
      const sourceNames = [...doc.blockRecords]
        .map(record => record.source?.name ?? null)
        .filter((name): name is string => name !== null)
        .sort();
      const blockRepresentationData = [...(doc as any)._cadObjects.values()]
        .filter((cadObject): cadObject is BlockRepresentationData => cadObject instanceof BlockRepresentationData);

      expect(sourceNames).toEqual(['my-dynamic-block', 'my-dynamic-block']);
      expect(blockRepresentationData).toHaveLength(2);
      expect(blockRepresentationData.every(entry => entry.block?.name === 'my-dynamic-block')).toBe(true);
    });

    it('preserves AC1018 block representation data and dimension associations on roundtrip', () => {
      const sample = dwgFiles.find(f => f.fileName === 'sample_AC1018.dwg');
      expect(sample).toBeDefined();

      const doc = new DwgReader(readFileAsArrayBuffer(sample!.path)).read();
      const originalObjects = [...(doc as any)._cadObjects.values()];
      const blockRepresentationCount = originalObjects.filter(
        (cadObject): cadObject is BlockRepresentationData => cadObject instanceof BlockRepresentationData,
      ).length;
      const dimensionAssociationCount = originalObjects.filter(
        (cadObject): cadObject is DimensionAssociation => cadObject instanceof DimensionAssociation,
      ).length;

      expect(blockRepresentationCount).toBeGreaterThan(0);
      expect(dimensionAssociationCount).toBeGreaterThan(0);

      const buffer = new ArrayBuffer(16 * 1024 * 1024);
      const writer = new DwgWriter(buffer, doc);
      writer.write();

      const outPath = path.join(roundtripOutDir, 'rt_sample_AC1018_object-links.dwg');
      fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

      const reread = new DwgReader(readFileAsArrayBuffer(outPath)).read();
      const rereadObjects = [...(reread as any)._cadObjects.values()];

      expect(rereadObjects.filter((cadObject): cadObject is BlockRepresentationData => cadObject instanceof BlockRepresentationData)).toHaveLength(blockRepresentationCount);
      expect(rereadObjects.filter((cadObject): cadObject is DimensionAssociation => cadObject instanceof DimensionAssociation)).toHaveLength(dimensionAssociationCount);
    });

    it('preserves AC1018 multileaders on roundtrip', () => {
      const sample = dwgFiles.find(f => f.fileName === 'sample_AC1018.dwg');
      expect(sample).toBeDefined();

      const doc = new DwgReader(readFileAsArrayBuffer(sample!.path)).read();
      const multiLeaderCount = [...doc.entities].filter((entity): entity is MultiLeader => entity instanceof MultiLeader).length;

      expect(multiLeaderCount).toBeGreaterThan(0);

      const buffer = new ArrayBuffer(16 * 1024 * 1024);
      const writer = new DwgWriter(buffer, doc);
      writer.write();

      const outPath = path.join(roundtripOutDir, 'rt_sample_AC1018_multileaders.dwg');
      fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

      const reread = new DwgReader(readFileAsArrayBuffer(outPath)).read();
      const rereadCount = [...reread.entities].filter((entity): entity is MultiLeader => entity instanceof MultiLeader).length;

      expect(rereadCount).toBe(multiLeaderCount);
    });

    it('preserves AC1018 evaluation graphs on roundtrip', () => {
      const sample = dwgFiles.find(f => f.fileName === 'sample_AC1018.dwg');
      expect(sample).toBeDefined();

      const doc = new DwgReader(readFileAsArrayBuffer(sample!.path)).read();
      const originalObjects = [...(doc as any)._cadObjects.values()];
      const evaluationGraphCount = originalObjects.filter(
        (cadObject): cadObject is EvaluationGraph => cadObject instanceof EvaluationGraph,
      ).length;

      expect(evaluationGraphCount).toBeGreaterThan(0);

      const buffer = new ArrayBuffer(16 * 1024 * 1024);
      const writer = new DwgWriter(buffer, doc);
      writer.write();

      const outPath = path.join(roundtripOutDir, 'rt_sample_AC1018_evaluation-graphs.dwg');
      fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

      const reread = new DwgReader(readFileAsArrayBuffer(outPath)).read();
      const rereadObjects = [...(reread as any)._cadObjects.values()];

      expect(rereadObjects.filter((cadObject): cadObject is EvaluationGraph => cadObject instanceof EvaluationGraph)).toHaveLength(evaluationGraphCount);
    });

    it('preserves AC1018 visual styles on roundtrip', () => {
      const sample = dwgFiles.find(f => f.fileName === 'sample_AC1018.dwg');
      expect(sample).toBeDefined();

      const doc = new DwgReader(readFileAsArrayBuffer(sample!.path)).read();
      const originalObjects = [...(doc as any)._cadObjects.values()];
      const visualStyleCount = originalObjects.filter(
        (cadObject): cadObject is VisualStyle => cadObject instanceof VisualStyle,
      ).length;

      expect(visualStyleCount).toBeGreaterThan(0);

      const buffer = new ArrayBuffer(16 * 1024 * 1024);
      const writer = new DwgWriter(buffer, doc);
      writer.write();

      const outPath = path.join(roundtripOutDir, 'rt_sample_AC1018_visual-styles.dwg');
      fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

      const reread = new DwgReader(readFileAsArrayBuffer(outPath)).read();
      const rereadObjects = [...(reread as any)._cadObjects.values()];

      expect(rereadObjects.filter((cadObject): cadObject is VisualStyle => cadObject instanceof VisualStyle)).toHaveLength(visualStyleCount);
    });

    it('preserves AC1018 table styles on roundtrip', () => {
      const sample = dwgFiles.find(f => f.fileName === 'sample_AC1018.dwg');
      expect(sample).toBeDefined();

      const doc = new DwgReader(readFileAsArrayBuffer(sample!.path)).read();
      const originalObjects = [...(doc as any)._cadObjects.values()];
      const tableStyleCount = originalObjects.filter(
        (cadObject): cadObject is TableStyle => cadObject instanceof TableStyle,
      ).length;

      expect(tableStyleCount).toBeGreaterThan(0);

      const buffer = new ArrayBuffer(16 * 1024 * 1024);
      const writer = new DwgWriter(buffer, doc);
      writer.write();

      const outPath = path.join(roundtripOutDir, 'rt_sample_AC1018_table-styles.dwg');
      fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

      const reread = new DwgReader(readFileAsArrayBuffer(outPath)).read();
      const rereadObjects = [...(reread as any)._cadObjects.values()];

      expect(rereadObjects.filter((cadObject): cadObject is TableStyle => cadObject instanceof TableStyle)).toHaveLength(tableStyleCount);
    });

    it('preserves AC1018 materials on roundtrip', () => {
      const sample = dwgFiles.find(f => f.fileName === 'sample_AC1018.dwg');
      expect(sample).toBeDefined();

      const doc = new DwgReader(readFileAsArrayBuffer(sample!.path)).read();
      const originalObjects = [...(doc as any)._cadObjects.values()];
      const materialCount = originalObjects.filter(
        (cadObject): cadObject is Material => cadObject instanceof Material,
      ).length;

      expect(materialCount).toBeGreaterThan(0);

      const buffer = new ArrayBuffer(16 * 1024 * 1024);
      const writer = new DwgWriter(buffer, doc);
      writer.write();

      const outPath = path.join(roundtripOutDir, 'rt_sample_AC1018_materials.dwg');
      fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

      const reread = new DwgReader(readFileAsArrayBuffer(outPath)).read();
      const rereadObjects = [...(reread as any)._cadObjects.values()];

      expect(rereadObjects.filter((cadObject): cadObject is Material => cadObject instanceof Material)).toHaveLength(materialCount);
    });

    it('detects AC1018 dimension style overrides before roundtrip', () => {
      const sample = dwgFiles.find(f => f.fileName === 'sample_AC1018.dwg');
      expect(sample).toBeDefined();

      const data = readFileAsArrayBuffer(sample!.path);
      const doc = new DwgReader(data).read();
      const dimensions = [...doc.entities].filter((entity): entity is Dimension => entity instanceof Dimension);
      const overrides = dimensions.filter(dimension => dimension.hasStyleOverride);

      expect(overrides).toHaveLength(3);
      expect(overrides.every(dimension => dimension.extendedData.size > 0)).toBe(true);
    });

    it('preserves AC1018 modeler geometry entities on roundtrip', () => {
      const sample = dwgFiles.find(f => f.fileName === 'sample_AC1018.dwg');
      expect(sample).toBeDefined();

      const doc = new DwgReader(readFileAsArrayBuffer(sample!.path)).read();
      const solidCount = [...doc.entities].filter((entity): entity is Solid3D => entity instanceof Solid3D).length;
      const regionCount = [...doc.entities].filter((entity): entity is Region => entity instanceof Region).length;

      expect(solidCount).toBeGreaterThan(0);
      expect(regionCount).toBeGreaterThan(0);

      const buffer = new ArrayBuffer(16 * 1024 * 1024);
      const writer = new DwgWriter(buffer, doc);
      writer.write();

      const outPath = path.join(roundtripOutDir, 'rt_sample_AC1018_modeler-geometry.dwg');
      fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

      const reread = new DwgReader(readFileAsArrayBuffer(outPath)).read();

      expect([...reread.entities].filter((entity): entity is Solid3D => entity instanceof Solid3D)).toHaveLength(solidCount);
      expect([...reread.entities].filter((entity): entity is Region => entity instanceof Region)).toHaveLength(regionCount);
    });

    it('preserves AEC wall entities on roundtrip', () => {
      const sample = path.join(process.cwd(), 'samples', 'aec_objects', 'AecObjects.dwg');
      expect(fs.existsSync(sample)).toBe(true);

      const doc = new DwgReader(readFileAsArrayBuffer(sample)).read();
      const walls = [...doc.entities].filter((entity): entity is Wall => entity instanceof Wall);
      const wallCount = walls.length;
      const originalWall = walls[0];

      expect(wallCount).toBeGreaterThan(0);
      expect(originalWall).toBeDefined();

      const buffer = new ArrayBuffer(16 * 1024 * 1024);
      const writer = new DwgWriter(buffer, doc);
      writer.write();

      const outPath = path.join(roundtripOutDir, 'rt_aec_objects.dwg');
      fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

      const reread = new DwgReader(readFileAsArrayBuffer(outPath)).read();
      const rereadWalls = [...reread.entities].filter((entity): entity is Wall => entity instanceof Wall);
      const rereadWallCount = rereadWalls.length;
      const rereadWall = rereadWalls[0];

      expect(rereadWallCount).toBe(wallCount);
      expect(rereadWall).toBeDefined();
      expect((rereadWall!.rawData?.length ?? 0) > 0).toBe((originalWall!.rawData?.length ?? 0) > 0);
      expect(rereadWall!.version).toBe(originalWall!.version);
      expect(rereadWall!.style == null).toBe(originalWall!.style == null);
      expect(rereadWall!.cleanupGroup == null).toBe(originalWall!.cleanupGroup == null);
      expect(rereadWall!.binRecord == null).toBe(originalWall!.binRecord == null);

      if (originalWall!.style && rereadWall!.style) {
        expect(rereadWall!.style.description).toBe(originalWall!.style.description);
      }

      if (originalWall!.cleanupGroup && rereadWall!.cleanupGroup) {
        expect(rereadWall!.cleanupGroup.description).toBe(originalWall!.cleanupGroup.description);
      }

      if (originalWall!.binRecord && rereadWall!.binRecord) {
        expect(rereadWall!.binRecord.binaryData.length).toBe(originalWall!.binRecord.binaryData.length);
      }
    });

    describe.each(dwgFiles.map(f => [f.fileName, f]))('%s', (_name, test) => {
      it('Read -> Write -> Read', () => {
        // 1. Read original
        const data = readFileAsArrayBuffer(test.path);
        const reader = new DwgReader(data);
        const doc = reader.read();

        expect(doc).not.toBeNull();

        // Skip versions the DWG writer doesn't support
        if (doc.header.version < ACadVersion.AC1014) return;

        // 2. Write
        const buffer = new ArrayBuffer(16 * 1024 * 1024);
        const writer = new DwgWriter(buffer, doc);
        writer.write();

        const outPath = path.join(roundtripOutDir, `rt_${test.fileName}`);
        fs.writeFileSync(outPath, new Uint8Array(buffer, 0, writer.bytesWritten));

        // 3. Re-read
        const rereadData = readFileAsArrayBuffer(outPath);
        const reader2 = new DwgReader(rereadData);
        const doc2 = reader2.read();

        assertDocumentDefaults(doc2);

        // 4. Compare key properties (use >= because createDefaults adds missing defaults on re-read)
        expect(doc2.header.version).toBe(doc.header.version);
        expect(doc2.blockRecords.count).toBeGreaterThanOrEqual(doc.blockRecords.count);
        expect(doc2.layers.count).toBeGreaterThanOrEqual(doc.layers.count);
        expect(doc2.lineTypes.count).toBeGreaterThanOrEqual(doc.lineTypes.count);
      });
    });
  });

  describe('DXF ASCII Roundtrip', () => {
    describe.each(dxfAsciiFiles.map(f => [f.fileName, f]))('%s', (_name, test) => {
      it('Read -> Write -> Read', () => {
        // Skip AC1009 - version detection is incorrect (reads as AC1032)
        const isAC1009 = test.path.toLowerCase().includes('ac1009');

        // 1. Read original
        const data = readFileAsUint8Array(test.path);
        const reader = new DxfReader(data);
        const doc = reader.read();

        expect(doc).not.toBeNull();

        // 2. Write as ASCII DXF
        const stream = new InMemoryAsciiStream();
        const writer = new DxfWriter(stream as any, doc, false);
        writer.write();
        const written = stream.toUint8Array();

        const outPath = path.join(roundtripOutDir, `rt_${test.fileName}`);
        fs.writeFileSync(outPath, written);

        // 3. Re-read
        const reader2 = new DxfReader(written);
        const doc2 = reader2.read();

        expect(doc2).not.toBeNull();

        if (!isAC1009 && doc.header.version >= ACadVersion.AC1012) {
          assertDocumentDefaults(doc2);

          // 4. Compare key properties (use >= because createDefaults adds missing defaults on re-read)
          expect(doc2.header.version).toBe(doc.header.version);
          expect(doc2.blockRecords.count).toBeGreaterThanOrEqual(doc.blockRecords.count);
          expect(doc2.layers.count).toBeGreaterThanOrEqual(doc.layers.count);
          expect(doc2.lineTypes.count).toBeGreaterThanOrEqual(doc.lineTypes.count);
        }
      });
    });
  });

  describe('DXF Binary Roundtrip', () => {
    describe.each(dxfBinaryFiles.map(f => [f.fileName, f]))('%s', (_name, test) => {
      it('Read -> Write -> Read', () => {
        // Skip AC1009 binary (known unsupported)
        if (test.path.toLowerCase().includes('ac1009_binary')) return;

        // 1. Read original
        const data = readFileAsUint8Array(test.path);
        const reader = new DxfReader(data);
        const doc = reader.read();

        expect(doc).not.toBeNull();

        // 2. Write as ASCII DXF (roundtrip through ASCII for compatibility)
        const stream = new InMemoryAsciiStream();
        const writer = new DxfWriter(stream as any, doc, false);
        writer.write();
        const written = stream.toUint8Array();

        const outPath = path.join(roundtripOutDir, `rt_ascii_${test.fileName}`);
        fs.writeFileSync(outPath, written);

        // 3. Re-read
        const reader2 = new DxfReader(written);
        const doc2 = reader2.read();

        expect(doc2).not.toBeNull();

        if (doc.header.version >= ACadVersion.AC1012) {
          assertDocumentDefaults(doc2);

          // 4. Compare key properties (use >= because createDefaults adds missing defaults on re-read)
          expect(doc2.header.version).toBe(doc.header.version);
          expect(doc2.blockRecords.count).toBeGreaterThanOrEqual(doc.blockRecords.count);
          expect(doc2.layers.count).toBeGreaterThanOrEqual(doc.layers.count);
          expect(doc2.lineTypes.count).toBeGreaterThanOrEqual(doc.lineTypes.count);
        }
      });
    });
  });
});
