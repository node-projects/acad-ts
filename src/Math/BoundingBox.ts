import { XYZ } from './XYZ.js';

export class BoundingBox {
  min: XYZ;
  max: XYZ;

  get Min(): XYZ { return this.min; }
  set Min(v: XYZ) { this.min = v; }
  get Max(): XYZ { return this.max; }
  set Max(v: XYZ) { this.max = v; }

  get width(): number { return this.max.x - this.min.x; }
  get height(): number { return this.max.y - this.min.y; }
  get Width(): number { return this.width; }
  get Height(): number { return this.height; }

  get center(): XYZ {
    return new XYZ(
      (this.min.x + this.max.x) / 2,
      (this.min.y + this.max.y) / 2,
      (this.min.z + this.max.z) / 2
    );
  }
  get Center(): XYZ { return this.center; }

  constructor(min?: XYZ, max?: XYZ) {
    this.min = min ?? new XYZ(Infinity, Infinity, Infinity);
    this.max = max ?? new XYZ(-Infinity, -Infinity, -Infinity);
  }

  static readonly Null = new BoundingBox();
  static readonly Infinite = new BoundingBox(
    new XYZ(-Infinity, -Infinity, -Infinity),
    new XYZ(Infinity, Infinity, Infinity)
  );

  static FromPoints(points: XYZ[]): BoundingBox {
    if (!points || points.length === 0) return BoundingBox.Null;
    const bb = new BoundingBox();
    for (const p of points) {
      bb.min = new XYZ(Math.min(bb.min.x, p.x), Math.min(bb.min.y, p.y), Math.min(bb.min.z, p.z));
      bb.max = new XYZ(Math.max(bb.max.x, p.x), Math.max(bb.max.y, p.y), Math.max(bb.max.z, p.z));
    }
    return bb;
  }
}
