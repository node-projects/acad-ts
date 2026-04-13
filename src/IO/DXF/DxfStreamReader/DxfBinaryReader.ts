import { DxfStreamReaderBase } from './DxfStreamReaderBase.js';
import { DxfCode } from '../../../DxfCode.js';

export class DxfBinaryReader extends DxfStreamReaderBase {
  public static readonly Sentinel: string = 'AutoCAD Binary DXF\r\n\x1a\0';

  public static readonly SentinelBytes: Uint8Array = new Uint8Array([
    0x41, 0x75, 0x74, 0x6F, 0x43, 0x41, 0x44, 0x20,
    0x42, 0x69, 0x6E, 0x61, 0x72, 0x79, 0x20, 0x44,
    0x58, 0x46, 0x0D, 0x0A, 0x1A, 0x00,
  ]);

  protected get baseStream(): Uint8Array {
    return this._data;
  }

  protected _data: Uint8Array;
  protected _view: DataView;
  protected _pos: number = 0;

  public constructor(stream: Uint8Array) {
    super();
    this._data = stream;
    this._view = new DataView(stream.buffer, stream.byteOffset, stream.byteLength);
    this.Start();
  }

  public override Start(): void {
    super.Start();
    this._pos = 0;

    // Skip sentinel (22 bytes)
    this._pos = 22;
    this.Position = this._pos;
  }

  protected readStringLine(): string {
    const bytes: number[] = [];
    while (this._pos < this._data.length) {
      const b = this._data[this._pos++];
      if (b === 0) break;
      bytes.push(b);
    }

    this.ValueRaw = String.fromCharCode(...bytes);
    this.Position = this._pos;
    return this.ValueRaw;
  }

  protected readCode(): DxfCode {
    const code = this._view.getInt16(this._pos, true);
    this._pos += 2;
    this.Position = this._pos;
    return code as DxfCode;
  }

  protected lineAsBool(): boolean {
    const val = this._data[this._pos++];
    this.Position = this._pos;
    return val > 0;
  }

  protected lineAsDouble(): number {
    const val = this._view.getFloat64(this._pos, true);
    this._pos += 8;
    this.Position = this._pos;
    return val;
  }

  protected lineAsShort(): number {
    const val = this._view.getInt16(this._pos, true);
    this._pos += 2;
    this.Position = this._pos;
    return val;
  }

  protected lineAsInt(): number {
    const val = this._view.getInt32(this._pos, true);
    this._pos += 4;
    this.Position = this._pos;
    return val;
  }

  protected lineAsLong(): number {
    // Read as two 32-bit integers (JS doesn't have native 64-bit int)
    const lo = this._view.getUint32(this._pos, true);
    const hi = this._view.getInt32(this._pos + 4, true);
    this._pos += 8;
    this.Position = this._pos;
    return hi * 0x100000000 + lo;
  }

  protected lineAsHandle(): number {
    const str = this.readStringLine();
    const result = parseInt(str, 16);
    if (!isNaN(result)) {
      return result;
    }
    return 0;
  }

  protected lineAsBinaryChunk(): Uint8Array {
    const length = this._data[this._pos++];
    const chunk = this._data.slice(this._pos, this._pos + length);
    this._pos += length;
    this.Position = this._pos;
    return chunk;
  }
}
