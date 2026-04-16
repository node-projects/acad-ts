import { DxfCode } from '../../../DxfCode.js';
import { DxfClassMap } from '../../../DxfClassMap.js';
import { IVector } from '../../../Math/IVector.js';
import { Color } from '../../../Color.js';
import { IHandledCadObject } from '../../../IHandledCadObject.js';
import { INamedCadObject } from '../../../INamedCadObject.js';

export interface IDxfStreamWriter {
  writeOptional: boolean;

  close(): void;

  flush(): void;

  write(code: DxfCode | number, value: unknown, map?: DxfClassMap | null): void;

  writeVector(code: DxfCode | number, value: IVector, map?: DxfClassMap | null): void;

  writeIfNotDefault<T>(code: number, value: T, defaultValue: T, map?: DxfClassMap | null): void;

  writeCmColor(code: number, color: Color, map?: DxfClassMap | null): void;

  writeHandle(code: number, value: IHandledCadObject | null, map?: DxfClassMap | null): void;

  writeName(code: number, value: INamedCadObject | null, map?: DxfClassMap | null): void;

  writeTrueColor(code: number, color: Color, map?: DxfClassMap | null): void;

  dispose(): void;
}
