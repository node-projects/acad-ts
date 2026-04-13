import { DxfBinaryReader } from './DxfBinaryReader.js';
import { DxfCode } from '../../../DxfCode.js';

export class DxfBinaryReaderAC1009 extends DxfBinaryReader {
  public constructor(stream: Uint8Array) {
    super(stream);
  }

  protected override readCode(): DxfCode {
    let code = this._data[this._pos++];
    if (code === 0xFF) {
      code = this._view.getInt16(this._pos, true);
      this._pos += 2;
    }

    return code as DxfCode;
  }
}
