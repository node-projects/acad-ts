import { XYZ } from './Math/XYZ.js';

export interface IOrientable {
	normal: XYZ;
}

export function isOrientable(value: unknown): value is IOrientable {
	return value != null && typeof value === 'object' && (value as { normal?: unknown }).normal instanceof XYZ;
}
