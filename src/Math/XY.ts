import { IVector } from './IVector.js';

export class XY implements IVector {
  x: number;
  y: number;

  get dimension(): number { return 2; }
  get [0](): number { return this.x; }
  set [0](v: number) { this.x = v; }
  get [1](): number { return this.y; }
  set [1](v: number) { this.y = v; }

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  static readonly zero = new XY(0, 0);
  static readonly axisX = new XY(1, 0);
  static readonly axisY = new XY(0, 1);

  getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): XY {
    const len = this.getLength();
    if (len === 0) return new XY();
    return new XY(this.x / len, this.y / len);
  }

  getAngle(): number {
    return Math.atan2(this.y, this.x);
  }

  dot(other: XY): number {
    return this.x * other.x + this.y * other.y;
  }

  cross(other: XY): number {
    return this.x * other.y - this.y * other.x;
  }

  static cross(a: XY, b: XY): number {
    return a.x * b.y - a.y * b.x;
  }

  static polar(point: XY, angle: number, distance: number): XY {
    return new XY(
      point.x + distance * Math.cos(angle),
      point.y + distance * Math.sin(angle)
    );
  }

  static rotate(point: XY, angle: number): XY {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new XY(
      point.x * cos - point.y * sin,
      point.x * sin + point.y * cos
    );
  }

  equals(other: XY): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
