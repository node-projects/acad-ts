import { describe, it, expect } from 'vitest';
import { DimensionAngular2Line } from '../../src/Entities/DimensionAngular2Line.js';
import { DimensionAngular3Pt } from '../../src/Entities/DimensionAngular3Pt.js';
import { XYZ } from '../../src/Math/XYZ.js';

describe('DimensionAngularMeasurement', () => {
  it('computes angular 3-point measurement from geometry', () => {
    const dimension = new DimensionAngular3Pt();
    dimension.firstPoint = XYZ.axisY;
    dimension.secondPoint = XYZ.axisX;
    dimension.angleVertex = XYZ.zero;

    expect(dimension.measurement).toBeCloseTo(Math.PI / 2);
  });

  it('computes angular 2-line measurement when the arc falls in the opposite sector', () => {
    const dimension = new DimensionAngular2Line();
    dimension.firstPoint = XYZ.zero;
    dimension.secondPoint = new XYZ(1, 1, 0).normalize();
    dimension.angleVertex = XYZ.zero;
    dimension.definitionPoint = XYZ.axisX;
    dimension.dimensionArc = XYZ.axisY;

    expect(dimension.measurement).toBeCloseTo((Math.PI / 2) * 1.5);
  });

  it('updates angular 2-line definition point from offset', () => {
    const dimension = new DimensionAngular2Line();
    dimension.firstPoint = XYZ.zero;
    dimension.secondPoint = XYZ.axisY;
    dimension.normal = XYZ.axisZ;

    dimension.offset = 2;

    expect(dimension.definitionPoint.x).toBeCloseTo(-2);
    expect(dimension.definitionPoint.y).toBeCloseTo(1);
    expect(dimension.definitionPoint.z).toBeCloseTo(0);
    expect(dimension.offset).toBeCloseTo(2);
  });
});