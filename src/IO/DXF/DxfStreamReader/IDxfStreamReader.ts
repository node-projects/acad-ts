import { DxfCode } from '../../../DxfCode.js';
import { GroupCodeValueType } from '../../../GroupCodeValue.js';

export interface IDxfStreamReader {
  encoding: string;

  DxfCode: DxfCode;

  GroupCodeValue: GroupCodeValueType;

  Code: number;

  Value: unknown;

  Position: number;

  ValueAsString: string;

  ValueRaw: string;

  ValueAsBool: boolean;

  ValueAsShort: number;

  ValueAsUShort: number;

  ValueAsInt: number;

  ValueAsLong: number;

  ValueAsDouble: number;

  ValueAsAngle: number;

  ValueAsHandle: number;

  ValueAsBinaryChunk: Uint8Array;

  Find(dxfEntry: string): boolean;

  Start(): void;

  ReadNext(): void;

  ExpectedCode(code: number): void;
}
