import { DxfStreamWriterBase } from './DxfStreamWriterBase.js';
import { GroupCodeValue, GroupCodeValueType } from '../../../GroupCodeValue.js';

export class DxfAsciiWriter extends DxfStreamWriterBase {
  private _writer: { write(s: string): void; flush?(): void; close?(): void };
  private _lines: string[] = [];

  public constructor(writer: { write(s: string): void; flush?(): void; close?(): void }) {
    super();
    this._writer = writer;
  }

  public override Close(): void {
    if (this._writer.close) {
      this._writer.close();
    }
  }

  public override Dispose(): void {
    this.Close();
  }

  public override Flush(): void {
    if (this._writer.flush) {
      this._writer.flush();
    }
  }

  protected override writeDxfCode(code: number): void {
    let line: string;
    if (code < 10) {
      line = `  ${code}`;
    } else if (code < 100) {
      line = ` ${code}`;
    } else {
      line = `${code}`;
    }
    this._writer.write(line + '\n');
  }

  protected override writeValue(code: number, value: unknown): void {
    const type = GroupCodeValue.transformValue(code);
    let line: string;

    switch (type) {
      case GroupCodeValueType.String:
      case GroupCodeValueType.Comment:
      case GroupCodeValueType.ExtendedDataString:
        line = `${value}`;
        break;
      case GroupCodeValueType.Point3D:
      case GroupCodeValueType.Double:
      case GroupCodeValueType.ExtendedDataDouble:
        line = this.formatDouble(value as number);
        break;
      case GroupCodeValueType.Byte:
      case GroupCodeValueType.Int16:
      case GroupCodeValueType.ExtendedDataInt16:
        line = `${Math.trunc(value as number) & 0xFFFF}`;
        if ((value as number) < 0 && type === GroupCodeValueType.Int16) {
          line = `${Math.trunc(value as number)}`;
        }
        break;
      case GroupCodeValueType.Int32:
      case GroupCodeValueType.ExtendedDataInt32:
        line = `${Math.trunc(value as number)}`;
        break;
      case GroupCodeValueType.Int64:
        line = `${value}`;
        break;
      case GroupCodeValueType.Handle:
      case GroupCodeValueType.ObjectId:
      case GroupCodeValueType.ExtendedDataHandle:
        line = (value as number).toString(16).toUpperCase();
        break;
      case GroupCodeValueType.Bool:
        line = value ? '1' : '0';
        break;
      case GroupCodeValueType.Chunk:
      case GroupCodeValueType.ExtendedDataChunk: {
        const chunk = value as Uint8Array;
        let hex = '';
        for (let i = 0; i < chunk.length; i++) {
          hex += chunk[i].toString(16).toUpperCase().padStart(2, '0');
        }
        line = hex;
        break;
      }
      default:
        line = `${value}`;
        break;
    }

    this._writer.write(line + '\n');
  }

  private formatDouble(value: number): string {
    if (typeof value !== 'number' || isNaN(value)) {
      return '0.0';
    }
    let s = value.toFixed(16);
    // Remove trailing zeros but keep at least one decimal place
    if (s.includes('.')) {
      s = s.replace(/0+$/, '');
      if (s.endsWith('.')) {
        s += '0';
      }
    }
    return s;
  }
}
