export interface IGeometricEntity {
	applyTransform(transform: any /* Transform */): void;
	getBoundingBox(): any /* BoundingBox */;
}
