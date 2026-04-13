import { UnitsType } from '../../Types/Units/UnitsType.js';

export class SvgConverter {
  public static toSvg(value: number): string {
    return value.toString();
  }

  public static toSvgWithUnits(value: number, units: UnitsType): string {
    let unitSuffix = '';
    switch (units) {
      case UnitsType.Centimeters:
        unitSuffix = 'cm';
        break;
      case UnitsType.Millimeters:
        unitSuffix = 'mm';
        break;
      case UnitsType.Inches:
        unitSuffix = 'in';
        break;
    }

    return `${value.toString()}${unitSuffix}`;
  }

  public static vectorToSvg(vector: { x: number; y: number }): string {
    return `${SvgConverter.toSvg(vector.x)},${SvgConverter.toSvg(vector.y)}`;
  }

  public static vectorToSvgWithUnits(vector: { x: number; y: number }, units: UnitsType): string {
    return `${SvgConverter.toSvgWithUnits(vector.x, units)},${SvgConverter.toSvgWithUnits(vector.y, units)}`;
  }

  public static toPixelSize(value: number, units: UnitsType): number {
    switch (units) {
      case UnitsType.Inches:
        return value * 96;
      case UnitsType.Millimeters:
        return value * 96 / 25.4;
      case UnitsType.Unitless:
        return value;
      default:
        throw new Error(`Invalid units value: ${units}`);
    }
  }

  public static vectorToPixelSize<T extends { x: number; y: number; z?: number }>(value: T, units: UnitsType): T {
    const result = { ...value };
    result.x = SvgConverter.toPixelSize(result.x, units);
    result.y = SvgConverter.toPixelSize(result.y, units);
    if (result.z !== undefined) {
      result.z = SvgConverter.toPixelSize(result.z, units);
    }
    return result as T;
  }
}
