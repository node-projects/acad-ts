import { XYZ } from './XYZ.js';

export class BoundingBox {
  min: XYZ;
  max: XYZ;

  get width(): number { return this.max.x - this.min.x; }
  get height(): number { return this.max.y - this.min.y; }

  get center(): XYZ {
    return new XYZ(
      (this.min.x + this.max.x) / 2,
      (this.min.y + this.max.y) / 2,
      (this.min.z + this.max.z) / 2
    );
  }

  constructor(min?: XYZ, max?: XYZ) {
    this.min = min ?? new XYZ(Infinity, Infinity, Infinity);
    this.max = max ?? new XYZ(-Infinity, -Infinity, -Infinity);
  }

  static readonly null = new BoundingBox();
  static readonly infinite = new BoundingBox(
    new XYZ(-Infinity, -Infinity, -Infinity),
    new XYZ(Infinity, Infinity, Infinity)
  );

  static fromPoints(points: XYZ[]): BoundingBox {
    if (!points || points.length === 0) return BoundingBox.null;
    const bb = new BoundingBox();
    for (const p of points) {
      bb.min = new XYZ(Math.min(bb.min.x, p.x), Math.min(bb.min.y, p.y), Math.min(bb.min.z, p.z));
      bb.max = new XYZ(Math.max(bb.max.x, p.x), Math.max(bb.max.y, p.y), Math.max(bb.max.z, p.z));
    }
    return bb;
  }
}
