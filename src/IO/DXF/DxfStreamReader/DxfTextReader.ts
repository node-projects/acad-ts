import { DxfStreamReaderBase } from './DxfStreamReaderBase.js';
import { DxfCode } from '../../../DxfCode.js';

export class DxfTextReader extends DxfStreamReaderBase {
  protected get baseStream(): Uint8Array {
    return this._data;
  }

  private _data: Uint8Array;
  private _bytePos: number = 0;

  public constructor(stream: Uint8Array) {
    super();
    this._data = stream;
    this.start();
  }

  public override start(): void {
    super.start();

    this._bytePos = 0;
  }

  public override readNext(): void {
    super.readNext();
    this.position += 2;
  }

  protected readStringLine(): string {
    let end = this._bytePos;
    while (end < this._data.length && this._data[end] !== 0x0A) {
      end++;
    }

    let lineBytes = this._data.subarray(this._bytePos, end);
    this._bytePos = end < this._data.length ? end + 1 : end;

    if (lineBytes.length > 0 && lineBytes[lineBytes.length - 1] === 0x0D) {
      lineBytes = lineBytes.subarray(0, lineBytes.length - 1);
    }

    let line = this.decodeString(lineBytes);

    // Trim whitespace like C# StreamReader.ReadLine()
    line = line.trim();
    this.valueRaw = line;
    return this.valueRaw;
  }

  protected readCode(): DxfCode {
    const line = this.readStringLine();

    const value = parseInt(line, 10);
    if (!isNaN(value)) {
      return value as DxfCode;
    }

    this.position++;

    return DxfCode.Invalid;
  }

  protected lineAsBool(): boolean {
    const str = this.readStringLine();
    const result = parseInt(str, 10);
    if (!isNaN(result)) {
      return result > 0;
    }
    return false;
  }

  protected lineAsDouble(): number {
    const str = this.readStringLine();
    const result = parseFloat(str);
    if (!isNaN(result)) {
      return result;
    }
    return 0.0;
  }

  protected lineAsShort(): number {
    const str = this.readStringLine();
    const result = parseInt(str, 10);
    if (!isNaN(result)) {
      return result;
    }
    return 0;
  }

  protected lineAsInt(): number {
    const str = this.readStringLine();
    const result = parseInt(str, 10);
    if (!isNaN(result)) {
      return result;
    }
    return 0;
  }

  protected lineAsLong(): number {
    const str = this.readStringLine();
    const result = parseInt(str, 10);
    if (!isNaN(result)) {
      return result;
    }
    return 0;
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
    const str = this.readStringLine();
    const bytes: number[] = [];

    for (let i = 0; i < str.length; i += 2) {
      const hex = str.substring(i, i + 2);
      const result = parseInt(hex, 16);
      if (!isNaN(result)) {
        bytes.push(result);
      } else {
        return new Uint8Array(0);
      }
    }

    return new Uint8Array(bytes);
  }
}
