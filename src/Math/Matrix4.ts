export class Matrix4 {
  m00: number = 1; m01: number = 0; m02: number = 0; m03: number = 0;
  m10: number = 0; m11: number = 1; m12: number = 0; m13: number = 0;
  m20: number = 0; m21: number = 0; m22: number = 1; m23: number = 0;
  m30: number = 0; m31: number = 0; m32: number = 0; m33: number = 1;

  constructor(values?: number[]) {
    if (!values || values.length === 0) {
      return;
    }

    if (values.length !== 16) {
      throw new Error('Matrix4 requires 16 values.');
    }

    [
      this.m00, this.m01, this.m02, this.m03,
      this.m10, this.m11, this.m12, this.m13,
      this.m20, this.m21, this.m22, this.m23,
      this.m30, this.m31, this.m32, this.m33,
    ] = values;
  }

  static identity(): Matrix4 {
    return new Matrix4();
  }

  get(row: number, col: number): number {
    const key = `m${row}${col}` as keyof Matrix4;
    return this[key] as number;
  }

  setElement(row: number, col: number, value: number): void {
    const key = `m${row}${col}` as keyof Matrix4;
    (this as unknown as Record<string, number>)[key] = value;
  }
}
