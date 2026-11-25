import { AcisTextCodec } from './AcisTextCodec.js';
/** ACIS mirroring and payload inspection; the original codec API remains available. */
export class AcisEncryption {
  static encode(text: string): string;
  static encode(data: Uint8Array): Uint8Array;
  static encode(value: string | Uint8Array): string | Uint8Array { return typeof value === 'string' ? AcisTextCodec.decode(value) : AcisTextCodec.decode(value); }
  static decode(text: string): string;
  static decode(data: Uint8Array): Uint8Array;
  static decode(value: string | Uint8Array): string | Uint8Array {
    return typeof value === 'string' ? this.isEncoded(value) ? AcisTextCodec.decode(value) : value : AcisTextCodec.decode(value);
  }
  static isEncoded(value: string | Uint8Array): boolean {
    if (typeof value === 'string') return AcisTextCodec.isEncoded(value);
    for (const byte of value) { if (byte > 32) return byte < 48 || byte > 57; }
    return false;
  }
  static isBinary(data: Uint8Array): boolean { return ['ACIS BinaryFile','ASM BinaryFile'].some(signature => signature.length <= data.length && [...signature].every((char,i)=>char.charCodeAt(0) === data[i])); }
  static trimAtAcisEnd(data: Uint8Array): Uint8Array { return AcisTextCodec.trimAtAcisEnd(data); }
}
