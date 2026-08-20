import type { DxfClass } from './DxfClass.js';

/** Provides the DXF class metadata associated with a CAD object. */
export interface IDxfClassDefined {
	getDxfClass(): DxfClass | null;
}
