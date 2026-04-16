export class MathHelper {
  static readonly epsilon: number = 1e-12;
  static readonly pi: number = Math.PI;
  static readonly halfPI: number = Math.PI / 2;
  static readonly twoPI: number = Math.PI * 2;

  static degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }

  static radToGrad(radians: number): number {
    return radians * (200 / Math.PI);
  }

  static isZero(value: number): boolean {
    return Math.abs(value) < MathHelper.epsilon;
  }

  static fixZero(value: number): number {
    return MathHelper.isZero(value) ? 0 : value;
  }

  static sin(angle: number): number {
    return MathHelper.fixZero(Math.sin(angle));
  }

  static cos(angle: number): number {
    return MathHelper.fixZero(Math.cos(angle));
  }
}
