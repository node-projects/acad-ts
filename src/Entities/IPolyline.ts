import { IEntity } from './IEntity.js';
import type { IVector } from '../Math/IVector.js';
import { XYZ } from '../Math/XYZ.js';

export interface IPolyline extends IEntity {
	isClosed: boolean;
	elevation: number;
	getPoints?(precision?: number): XYZ[];
	normal: XYZ;
	thickness: number;
	readonly vertices: Iterable<IVertex>;
}

export interface IVertex {
	location: IVector;
	bulge: number;
}
