import { XYZ } from './XYZ.js';
import { Matrix4 } from './Matrix4.js';

export class Transform {
  translation: XYZ;
  scale: XYZ;
  eulerRotation: XYZ;

  constructor(translation?: XYZ, scale?: XYZ, eulerRotation?: XYZ) {
    this.translation = translation ?? new XYZ(0, 0, 0);
    this.scale = scale ?? new XYZ(1, 1, 1);
    this.eulerRotation = eulerRotation ?? new XYZ(0, 0, 0);
  }

  get matrix(): Matrix4 {
    // Build TRS matrix
    const m = new Matrix4();
    const sx = this.scale.x, sy = this.scale.y, sz = this.scale.z;
    const rx = this.eulerRotation.x, ry = this.eulerRotation.y, rz = this.eulerRotation.z;
    const cx = Math.cos(rx), sx2 = Math.sin(rx);
    const cy = Math.cos(ry), sy2 = Math.sin(ry);
    const cz = Math.cos(rz), sz2 = Math.sin(rz);
    m.m00 = cy * cz * sx;
    m.m01 = -(cy * sz2) * sy;
    m.m02 = sy2 * sz;
    m.m10 = (cx * sz2 + cz * sx2 * sy2) * sx;
    m.m11 = (cx * cz - sx2 * sy2 * sz2) * sy;
    m.m12 = -(cy * sx2) * sz;
    m.m20 = (sx2 * sz2 - cx * cz * sy2) * sx;
    m.m21 = (cz * sx2 + cx * sy2 * sz2) * sy;
    m.m22 = (cx * cy) * sz;
    m.m03 = this.translation.x;
    m.m13 = this.translation.y;
    m.m23 = this.translation.z;
    return m;
  }

  applyTransform(point: XYZ): XYZ {
    const m = this.matrix;
    return new XYZ(
      m.m00 * point.x + m.m01 * point.y + m.m02 * point.z + m.m03,
      m.m10 * point.x + m.m11 * point.y + m.m12 * point.z + m.m13,
      m.m20 * point.x + m.m21 * point.y + m.m22 * point.z + m.m23
    );
  }

  static createTranslation(translation: XYZ): Transform {
    return new Transform(translation);
  }

  static createScaling(scale: XYZ, origin?: XYZ): Transform {
    const t = new Transform(undefined, scale);
    if (origin) {
      t.translation = new XYZ(
        origin.x * (1 - scale.x),
        origin.y * (1 - scale.y),
        origin.z * (1 - scale.z)
      );
    }
    return t;
  }

  static createRotation(axis: XYZ, angle: number): Transform {
    const t = new Transform();
    if (axis.z !== 0) t.eulerRotation = new XYZ(0, 0, angle);
    else if (axis.y !== 0) t.eulerRotation = new XYZ(0, angle, 0);
    else t.eulerRotation = new XYZ(angle, 0, 0);
    return t;
  }
}
