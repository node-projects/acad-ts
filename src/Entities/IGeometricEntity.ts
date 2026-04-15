import type { BoundingBox } from '../Math/BoundingBox.js';

export interface IGeometricEntity {
	applyTransform(transform: unknown): void;
	getBoundingBox(): BoundingBox | null;
}
