export { LittleEndianConverter } from '../Helpers/LittleEndianConverter.js';

export class BigEndianConverter {
  static toUInt64(buffer: Uint8Array, offset: number = 0): number {
    // JavaScript numbers can't represent all 64-bit integers exactly
    // but for handle values this is sufficient
    let result = 0;
    for (let i = 0; i < 8; i++) {
      result = result * 256 + buffer[offset + i];
    }
    return result;
  }

  static toUInt32(buffer: Uint8Array, offset: number = 0): number {
    return ((buffer[offset] << 24) | (buffer[offset + 1] << 16) | (buffer[offset + 2] << 8) | buffer[offset + 3]) >>> 0;
  }

  static toUInt16(buffer: Uint8Array, offset: number = 0): number {
    return (buffer[offset] << 8) | buffer[offset + 1];
  }
}
