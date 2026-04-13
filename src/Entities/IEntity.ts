import { IHandledCadObject } from '../IHandledCadObject.js';
import { IGeometricEntity } from './IGeometricEntity.js';
import { Color } from '../Color.js';
import { CadDocument } from '../CadDocument.js';
import { Layer } from '../Tables/Layer.js';
import { LineType } from '../Tables/LineType.js';
import { LineWeightType } from '../Types/LineWeightType.js';
import { Transparency } from '../Transparency.js';

export interface IEntity extends IHandledCadObject, IGeometricEntity {
	color: Color;
	readonly document: CadDocument | null;
	isInvisible: boolean;
	layer: Layer;
	lineType: LineType;
	lineTypeScale: number;
	lineWeight: LineWeightType;
	material: any; // Material
	transparency: Transparency;
	getActiveColor(): Color;
	getActiveLineType(): LineType;
	getActiveLineWeightType(): LineWeightType;
	matchProperties(entity: IEntity): void;
}
