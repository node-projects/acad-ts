import { IDxfStreamReader } from './IDxfStreamReader.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { GroupCodeValue, GroupCodeValueType } from '../../../GroupCodeValue.js';
import { DxfException } from '../../../Exceptions/DxfException.js';
import { MathHelper } from '../../../Math/MathHelper.js';
import { decodeCadString, getDecoderEncodingLabel } from '../../TextEncoding.js';

export abstract class DxfStreamReaderBase implements IDxfStreamReader {
  public encoding: string = getDecoderEncodingLabel('ANSI_1252');

  public dxfCode: DxfCode = DxfCode.Invalid;

  public groupCodeValue: GroupCodeValueType = GroupCodeValueType.None;

  public get code(): number {
    return this.dxfCode as number;
  }

  public value: unknown = '';

  public position: number = 0;

  public valueRaw: string = '';

  public get valueAsString(): string {
    return String(this.value)
      .replace(/\^J/g, '\n')
      .replace(/\^M/g, '\r')
      .replace(/\^I/g, '\t')
      .replace(/\^ /g, '^');
  }

  public get valueAsBool(): boolean {
    return Boolean(this.value);
  }

  public get valueAsShort(): number {
    return Number(this.value) & 0xFFFF;
  }

  public get valueAsUShort(): number {
    return (Number(this.value) & 0xFFFF) >>> 0;
  }

  public get valueAsInt(): number {
    return Number(this.value) | 0;
  }

  public get valueAsLong(): number {
    return Number(this.value);
  }

  public get valueAsDouble(): number {
    return Number(this.value);
  }

  public get valueAsAngle(): number {
    return MathHelper.degToRad(Number(this.value));
  }

  public get valueAsHandle(): number {
    return Number(this.value);
  }

  public get valueAsBinaryChunk(): Uint8Array {
    return this.value as Uint8Array;
  }

  protected abstract get baseStream(): Uint8Array;

  public readNext(): void {
    this.dxfCode = this.readCode();
    this.groupCodeValue = GroupCodeValue.transformValue(this.code);
    this.value = this._transformValue(this.groupCodeValue);

    if (this.dxfCode === DxfCode.Comment) {
      this.readNext();
    }
  }

  public find(dxfEntry: string): boolean {
    this.start();

    do {
      this.readNext();
    } while (this.valueAsString !== dxfEntry && this.valueAsString !== DxfFileToken.endOfFile);

    return this.valueAsString === dxfEntry;
  }

  public expectedCode(code: number): void {
    this.readNext();

    if (this.code !== code) {
      throw new DxfException(code, this.position);
    }
  }

  public toString(): string {
    return `${this.code} | ${this.value}`;
  }

  public start(): void {
    this.dxfCode = DxfCode.Invalid;
    this.value = '';

    this._streamPosition = 0;

    this.position = 0;
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

  protected decodeString(bytes: Uint8Array): string {
    return decodeCadString(bytes, this.encoding);
  }

  private _transformValue(code: GroupCodeValueType): unknown {
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
        throw new DxfException(code as number, this.position);
    }
  }
}
