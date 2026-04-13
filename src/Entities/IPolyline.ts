import { IEntity } from './IEntity.js';
import { XYZ } from '../Math/XYZ.js';

export interface IPolyline extends IEntity {
	isClosed: boolean;
	elevation: number;
	normal: XYZ;
	thickness: number;
	readonly vertices: Iterable<IVertex>;
}

export interface IVertex {
	location: any; // IVector
	bulge: number;
}
