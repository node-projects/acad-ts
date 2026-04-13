import { DxfStreamWriterBase } from './DxfStreamWriterBase.js';
import { GroupCodeValue, GroupCodeValueType } from '../../../GroupCodeValue.js';

export class DxfBinaryWriter extends DxfStreamWriterBase {
  public static readonly SentinelBytes: Uint8Array = new Uint8Array([
    65, 117, 116, 111, 67, 65, 68, 32, 66, 105,
    110, 97, 114, 121, 32, 68, 88, 70, 13, 10,
    26, 0
  ]);

  private _writer: DataView;
  private _buffer: Uint8Array;
  private _position: number = 0;
  private _stream: { write(data: Uint8Array): void; flush?(): void; close?(): void };

  public constructor(stream: { write(data: Uint8Array): void; flush?(): void; close?(): void }) {
    super();
    this._stream = stream;
    this._buffer = new Uint8Array(65536);
    this._writer = new DataView(this._buffer.buffer);

    // Write sentinel
    this._stream.write(DxfBinaryWriter.SentinelBytes);
  }

  public override Close(): void {
    this.flushBuffer();
    if (this._stream.close) {
      this._stream.close();
    }
  }

  public override Dispose(): void {
    this.Close();
  }

  public override Flush(): void {
    this.flushBuffer();
    if (this._stream.flush) {
      this._stream.flush();
    }
  }

  protected override writeDxfCode(code: number): void {
    this.ensureCapacity(2);
    this._writer.setInt16(this._position, code, true);
    this._position += 2;
  }

  protected override writeValue(code: number, value: any): void {
    const type = GroupCodeValue.transformValue(code);

    switch (type) {
      case GroupCodeValueType.String:
      case GroupCodeValueType.Comment:
      case GroupCodeValueType.ExtendedDataString: {
        const str = `${value}`;
        const encoded = new TextEncoder().encode(str);
        this.ensureCapacity(encoded.length + 1);
        this._buffer.set(encoded, this._position);
        this._position += encoded.length;
        this._buffer[this._position++] = 0; // null terminator
        break;
      }
      case GroupCodeValueType.Point3D:
      case GroupCodeValueType.Double:
      case GroupCodeValueType.ExtendedDataDouble:
        this.ensureCapacity(8);
        this._writer.setFloat64(this._position, value as number, true);
        this._position += 8;
        break;
      case GroupCodeValueType.Byte:
        this.ensureCapacity(1);
        this._buffer[this._position++] = (value as number) & 0xFF;
        break;
      case GroupCodeValueType.Int16:
      case GroupCodeValueType.ExtendedDataInt16:
        this.ensureCapacity(2);
        this._writer.setInt16(this._position, value as number, true);
        this._position += 2;
        break;
      case GroupCodeValueType.Int32:
      case GroupCodeValueType.ExtendedDataInt32:
        this.ensureCapacity(4);
        this._writer.setInt32(this._position, value as number, true);
        this._position += 4;
        break;
      case GroupCodeValueType.Int64:
        this.ensureCapacity(8);
        // Write as two 32-bit values for JavaScript compatibility
        this._writer.setInt32(this._position, (value as number) & 0xFFFFFFFF, true);
        this._writer.setInt32(this._position + 4, Math.floor((value as number) / 0x100000000), true);
        this._position += 8;
        break;
      case GroupCodeValueType.Handle:
      case GroupCodeValueType.ObjectId:
      case GroupCodeValueType.ExtendedDataHandle: {
        const hexStr = (value as number).toString(16).toUpperCase();
        const hexEncoded = new TextEncoder().encode(hexStr);
        this.ensureCapacity(hexEncoded.length + 1);
        this._buffer.set(hexEncoded, this._position);
        this._position += hexEncoded.length;
        this._buffer[this._position++] = 0; // null terminator
        break;
      }
      case GroupCodeValueType.Bool:
        this.ensureCapacity(1);
        this._buffer[this._position++] = value ? 1 : 0;
        break;
      case GroupCodeValueType.Chunk:
      case GroupCodeValueType.ExtendedDataChunk: {
        const chunk = value as Uint8Array;
        this.ensureCapacity(1 + chunk.length);
        this._buffer[this._position++] = chunk.length;
        this._buffer.set(chunk, this._position);
        this._position += chunk.length;
        break;
      }
      default: {
        const defaultStr = `${value}`;
        const defaultEncoded = new TextEncoder().encode(defaultStr);
        this.ensureCapacity(defaultEncoded.length + 1);
        this._buffer.set(defaultEncoded, this._position);
        this._position += defaultEncoded.length;
        this._buffer[this._position++] = 0;
        break;
      }
    }
  }

  private ensureCapacity(needed: number): void {
    if (this._position + needed > this._buffer.length) {
      this.flushBuffer();
      if (needed > this._buffer.length) {
        this._buffer = new Uint8Array(needed * 2);
        this._writer = new DataView(this._buffer.buffer);
      }
    }
  }

  private flushBuffer(): void {
    if (this._position > 0) {
      this._stream.write(this._buffer.slice(0, this._position));
      this._position = 0;
    }
  }
}
