import { IEntity } from './IEntity.js';
import { TextStyle } from '../Tables/TextStyle.js';
import { XYZ } from '../Math/XYZ.js';

export interface IText extends IEntity {
	height: number;
	value: string;
	style: TextStyle;
	insertPoint: XYZ;
	alignmentPoint: XYZ;
	readonly rotation: number;
}
