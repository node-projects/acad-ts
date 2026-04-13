import { IDxfStreamReader } from './IDxfStreamReader.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { GroupCodeValue, GroupCodeValueType } from '../../../GroupCodeValue.js';
import { DxfException } from '../../../Exceptions/DxfException.js';
import { MathHelper } from '../../../Math/MathHelper.js';

export abstract class DxfStreamReaderBase implements IDxfStreamReader {
  public DxfCode: DxfCode = DxfCode.Invalid;

  public GroupCodeValue: GroupCodeValueType = GroupCodeValueType.None;

  public get Code(): number {
    return this.DxfCode as number;
  }

  public Value: any = '';

  public Position: number = 0;

  public ValueRaw: string = '';

  public get ValueAsString(): string {
    return String(this.Value)
      .replace(/\^J/g, '\n')
      .replace(/\^M/g, '\r')
      .replace(/\^I/g, '\t')
      .replace(/\^ /g, '^');
  }

  public get ValueAsBool(): boolean {
    return Boolean(this.Value);
  }

  public get ValueAsShort(): number {
    return Number(this.Value) & 0xFFFF;
  }

  public get ValueAsUShort(): number {
    return (Number(this.Value) & 0xFFFF) >>> 0;
  }

  public get ValueAsInt(): number {
    return Number(this.Value) | 0;
  }

  public get ValueAsLong(): number {
    return Number(this.Value);
  }

  public get ValueAsDouble(): number {
    return Number(this.Value);
  }

  public get ValueAsAngle(): number {
    return MathHelper.DegToRad(Number(this.Value));
  }

  public get ValueAsHandle(): number {
    return Number(this.Value);
  }

  public get ValueAsBinaryChunk(): Uint8Array {
    return this.Value as Uint8Array;
  }

  protected abstract get baseStream(): Uint8Array;

  public ReadNext(): void {
    this.DxfCode = this.readCode();
    this.GroupCodeValue = GroupCodeValue.transformValue(this.Code);
    this.Value = this.transformValue(this.GroupCodeValue);

    if (this.DxfCode === DxfCode.Comment) {
      this.ReadNext();
    }
  }

  public Find(dxfEntry: string): boolean {
    this.Start();

    do {
      this.ReadNext();
    } while (this.ValueAsString !== dxfEntry && this.ValueAsString !== DxfFileToken.EndOfFile);

    return this.ValueAsString === dxfEntry;
  }

  public ExpectedCode(code: number): void {
    this.ReadNext();

    if (this.Code !== code) {
      throw new DxfException(code, this.Position);
    }
  }

  public toString(): string {
    return `${this.Code} | ${this.Value}`;
  }

  public Start(): void {
    this.DxfCode = DxfCode.Invalid;
    this.Value = '';

    this._streamPosition = 0;

    this.Position = 0;
  }

  protected _streamPosition: number = 0;

  protected abstract readCode(): DxfCode;

  protected abstract readStringLine(): string;

  protected abstract lineAsDouble(): number;

  protected abstract lineAsShort(): number;

  protected abstract lineAsInt(): number;

  protected abstract lineAsLong(): number;

  protected abstract lineAsHandle(): number;

  protected abstract lineAsBinaryChunk(): Uint8Array;

  protected abstract lineAsBool(): boolean;

  private transformValue(code: GroupCodeValueType): any {
    switch (code) {
      case GroupCodeValueType.String:
      case GroupCodeValueType.Comment:
      case GroupCodeValueType.ExtendedDataString:
        return this.readStringLine();
      case GroupCodeValueType.Point3D:
      case GroupCodeValueType.Double:
      case GroupCodeValueType.ExtendedDataDouble:
        return this.lineAsDouble();
      case GroupCodeValueType.Byte:
      case GroupCodeValueType.Int16:
      case GroupCodeValueType.ExtendedDataInt16:
        return this.lineAsShort();
      case GroupCodeValueType.Int32:
      case GroupCodeValueType.ExtendedDataInt32:
        return this.lineAsInt();
      case GroupCodeValueType.Int64:
        return this.lineAsLong();
      case GroupCodeValueType.Handle:
      case GroupCodeValueType.ObjectId:
      case GroupCodeValueType.ExtendedDataHandle:
        return this.lineAsHandle();
      case GroupCodeValueType.Bool:
        return this.lineAsBool();
      case GroupCodeValueType.Chunk:
      case GroupCodeValueType.ExtendedDataChunk:
        return this.lineAsBinaryChunk();
      case GroupCodeValueType.None:
      default:
        throw new DxfException(code as number, this.Position);
    }
  }
}
