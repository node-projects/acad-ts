import { IVector } from './IVector.js';

export class XYZ implements IVector {
  x: number;
  y: number;
  z: number;

  get dimension(): number { return 3; }
  get [0](): number { return this.x; }
  set [0](v: number) { this.x = v; }
  get [1](): number { return this.y; }
  set [1](v: number) { this.y = v; }
  get [2](): number { return this.z; }
  set [2](v: number) { this.z = v; }

  // PascalCase aliases for C# compat
  get X(): number { return this.x; }
  set X(v: number) { this.x = v; }
  get Y(): number { return this.y; }
  set Y(v: number) { this.y = v; }
  get Z(): number { return this.z; }
  set Z(v: number) { this.z = v; }

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static readonly Zero = new XYZ(0, 0, 0);
  static readonly AxisX = new XYZ(1, 0, 0);
  static readonly AxisY = new XYZ(0, 1, 0);
  static readonly AxisZ = new XYZ(0, 0, 1);
  static readonly NaN = new XYZ(Number.NaN, Number.NaN, Number.NaN);

  getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize(): XYZ {
    const len = this.getLength();
    if (len === 0) return new XYZ();
    return new XYZ(this.x / len, this.y / len, this.z / len);
  }

  getAngle(): number {
    return Math.atan2(this.y, this.x);
  }

  dot(other: XYZ): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  cross(other: XYZ): XYZ {
    return new XYZ(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }

  static Cross(a: XYZ, b: XYZ): XYZ {
    return new XYZ(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
  }

  static equals(a: XYZ, b: XYZ): boolean {
    return a.x === b.x && a.y === b.y && a.z === b.z;
  }

  equals(other: XYZ): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }
}
