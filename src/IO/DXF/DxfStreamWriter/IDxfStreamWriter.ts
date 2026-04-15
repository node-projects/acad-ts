import { DxfCode } from '../../../DxfCode.js';
import { DxfClassMap } from '../../../DxfClassMap.js';
import { IVector } from '../../../Math/IVector.js';
import { Color } from '../../../Color.js';
import { IHandledCadObject } from '../../../IHandledCadObject.js';
import { INamedCadObject } from '../../../INamedCadObject.js';

export interface IDxfStreamWriter {
  WriteOptional: boolean;

  Close(): void;

  Flush(): void;

  Write(code: DxfCode | number, value: unknown, map?: DxfClassMap | null): void;

  WriteVector(code: DxfCode | number, value: IVector, map?: DxfClassMap | null): void;

  WriteIfNotDefault<T>(code: number, value: T, defaultValue: T, map?: DxfClassMap | null): void;

  WriteCmColor(code: number, color: Color, map?: DxfClassMap | null): void;

  WriteHandle(code: number, value: IHandledCadObject | null, map?: DxfClassMap | null): void;

  WriteName(code: number, value: INamedCadObject | null, map?: DxfClassMap | null): void;

  WriteTrueColor(code: number, color: Color, map?: DxfClassMap | null): void;

  Dispose(): void;
}
