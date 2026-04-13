import { DxfStreamReaderBase } from './DxfStreamReaderBase.js';
import { DxfCode } from '../../../DxfCode.js';

export class DxfTextReader extends DxfStreamReaderBase {
  protected get baseStream(): Uint8Array {
    return this._data;
  }

  private _data: Uint8Array;
  private _text: string;
  private _textPos: number = 0;

  public constructor(stream: Uint8Array) {
    super();
    this._data = stream;
    this._text = new TextDecoder('utf-8').decode(stream);
    this.Start();
  }

  public override Start(): void {
    super.Start();

    this._textPos = 0;
  }

  public override ReadNext(): void {
    super.ReadNext();
    this.Position += 2;
  }

  protected readStringLine(): string {
    let end = this._text.indexOf('\n', this._textPos);
    if (end === -1) {
      end = this._text.length;
    }
    let line = this._text.substring(this._textPos, end);
    this._textPos = end + 1;

    // Remove trailing \r
    if (line.endsWith('\r')) {
      line = line.substring(0, line.length - 1);
    }

    // Trim whitespace like C# StreamReader.ReadLine()
    line = line.trim();
    this.ValueRaw = line;
    return this.ValueRaw;
  }

  protected readCode(): DxfCode {
    const line = this.readStringLine();

    const value = parseInt(line, 10);
    if (!isNaN(value)) {
      return value as DxfCode;
    }

    this.Position++;

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
