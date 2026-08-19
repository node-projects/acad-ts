import { describe, expect, it } from 'vitest';
import { DxfReader } from '../../../src/IO/DXF/DxfReader.js';
import { Polyline } from '../../../src/Entities/Polyline.js';
import { Polyline2D } from '../../../src/Entities/Polyline2D.js';
import { Polyline3D } from '../../../src/Entities/Polyline3D.js';
import { PolyfaceMesh } from '../../../src/Entities/PolyfaceMesh.js';
import { PolygonMesh } from '../../../src/Entities/PolygonMesh.js';
import { SmoothSurfaceType } from '../../../src/Entities/SmoothSurfaceType.js';

function polylineEntity(handle: string, subclass: string, flags: number, extra: string[] = []): string[] {
  return [
    '0', 'POLYLINE',
    '5', handle,
    '100', 'AcDbEntity',
    '8', '0',
    '100', subclass,
    '10', '0',
    '20', '0',
    '30', '3',
    '39', '2',
    '40', '0.5',
    '41', '0.75',
    '70', String(flags),
    '75', String(SmoothSurfaceType.Quadratic),
    '210', '1',
    '220', '2',
    '230', '3',
    ...extra,
  ];
}

function expectSharedFields(polyline: Polyline, flags: number): void {
  expect(polyline.elevation).toBe(3);
  expect(polyline.endWidth).toBe(0.75);
  expect(polyline.flags).toBe(flags);
  expect(polyline.normal).toMatchObject({ x: 1, y: 2, z: 3 });
  expect(polyline.smoothSurface).toBe(SmoothSurfaceType.Quadratic);
  expect(polyline.startWidth).toBe(0.5);
  expect(polyline.thickness).toBe(2);
}

describe('old-style POLYLINE metadata', () => {
  it('reads shared subclass fields for every polyline kind', () => {
    const lines = [
      '0', 'SECTION',
      '2', 'HEADER',
      '9', '$ACADVER',
      '1', 'AC1015',
      '0', 'ENDSEC',
      '0', 'SECTION',
      '2', 'ENTITIES',
      ...polylineEntity('10', 'AcDb2dPolyline', 129),
      ...polylineEntity('11', 'AcDb3dPolyline', 137),
      ...polylineEntity('12', 'AcDbPolyFaceMesh', 193, ['71', '4', '72', '2']),
      ...polylineEntity('13', 'AcDbPolygonMesh', 145, ['71', '4', '72', '5', '73', '6', '74', '7']),
      '0', 'ENDSEC',
      '0', 'EOF',
    ];
    const data = new TextEncoder().encode(`${lines.join('\r\n')}\r\n`);

    const document = new DxfReader(data).read();
    const entities = [...document.entities];
    const polyline2d = entities.find(entity => entity instanceof Polyline2D) as Polyline2D;
    const polyline3d = entities.find(entity => entity instanceof Polyline3D) as Polyline3D;
    const polyfaceMesh = entities.find(entity => entity instanceof PolyfaceMesh) as PolyfaceMesh;
    const polygonMesh = entities.find(entity => entity instanceof PolygonMesh) as PolygonMesh;

    expectSharedFields(polyline2d, 129);
    expectSharedFields(polyline3d, 137);
    expectSharedFields(polyfaceMesh, 193);
    expectSharedFields(polygonMesh, 145);
    expect(polygonMesh.mVertexCount).toBe(4);
    expect(polygonMesh.nVertexCount).toBe(5);
    expect(polygonMesh.mSmoothSurfaceDensity).toBe(6);
    expect(polygonMesh.nSmoothSurfaceDensity).toBe(7);
  });
});
