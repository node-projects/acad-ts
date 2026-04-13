export class MathHelper {
  static readonly Epsilon: number = 1e-12;
  static readonly PI: number = Math.PI;
  static readonly HalfPI: number = Math.PI / 2;
  static readonly TwoPI: number = Math.PI * 2;

  static DegToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static RadToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }

  static RadToGrad(radians: number): number {
    return radians * (200 / Math.PI);
  }

  static IsZero(value: number): boolean {
    return Math.abs(value) < MathHelper.Epsilon;
  }

  static FixZero(value: number): number {
    return MathHelper.IsZero(value) ? 0 : value;
  }

  static Sin(angle: number): number {
    return MathHelper.FixZero(Math.sin(angle));
  }

  static Cos(angle: number): number {
    return MathHelper.FixZero(Math.cos(angle));
  }
}
