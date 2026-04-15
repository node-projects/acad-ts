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

  // PascalCase aliases
  get M00(): number { return this.m00; } set M00(v: number) { this.m00 = v; }
  get M01(): number { return this.m01; } set M01(v: number) { this.m01 = v; }
  get M02(): number { return this.m02; } set M02(v: number) { this.m02 = v; }
  get M03(): number { return this.m03; } set M03(v: number) { this.m03 = v; }
  get M10(): number { return this.m10; } set M10(v: number) { this.m10 = v; }
  get M11(): number { return this.m11; } set M11(v: number) { this.m11 = v; }
  get M12(): number { return this.m12; } set M12(v: number) { this.m12 = v; }
  get M13(): number { return this.m13; } set M13(v: number) { this.m13 = v; }
  get M20(): number { return this.m20; } set M20(v: number) { this.m20 = v; }
  get M21(): number { return this.m21; } set M21(v: number) { this.m21 = v; }
  get M22(): number { return this.m22; } set M22(v: number) { this.m22 = v; }
  get M23(): number { return this.m23; } set M23(v: number) { this.m23 = v; }
  get M30(): number { return this.m30; } set M30(v: number) { this.m30 = v; }
  get M31(): number { return this.m31; } set M31(v: number) { this.m31 = v; }
  get M32(): number { return this.m32; } set M32(v: number) { this.m32 = v; }
  get M33(): number { return this.m33; } set M33(v: number) { this.m33 = v; }

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
