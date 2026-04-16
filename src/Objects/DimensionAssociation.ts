import { NonGraphicalObject } from './NonGraphicalObject.js';
import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { AssociativityFlags } from './AssociativityFlags.js';
import { ObjectOsnapType } from './ObjectOsnapType.js';
import { RotatedDimensionType } from './RotatedDimensionType.js';
import { SubentType } from './SubentType.js';
import { XYZ } from '../Math/XYZ.js';
import { Dimension } from '../Entities/Dimension.js';

export class OsnapPointRef {
	geometryParameter: number = 0;
	objectOsnapType: ObjectOsnapType = ObjectOsnapType.None;
	osnapPoint: XYZ = new XYZ(0, 0, 0);
	subentType: SubentType = SubentType.Unknown;
	gsMarker: number = 0;
	intersectionSubType: SubentType = SubentType.Unknown;
	intersectionGsMarker: number = 0;
	hasLastPointRef: boolean = false;
	geometry: CadObject | null = null;
}

export class DimensionAssociation extends NonGraphicalObject {
	associativityFlags: AssociativityFlags = AssociativityFlags.None;
	dimension: Dimension | null = null;
	firstPointRef: OsnapPointRef | null = null;
	fourthPointRef: OsnapPointRef | null = null;
	isTransSpace: boolean = false;

	override get objectName(): string {
		return DxfFileToken.objectDimensionAssociation;
	}

	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	rotatedDimensionType: RotatedDimensionType = RotatedDimensionType.Unknown;
	secondPointRef: OsnapPointRef | null = null;

	override get subclassMarker(): string {
		return DxfSubclassMarker.dimensionAssociation;
	}

	thirdPointRef: OsnapPointRef | null = null;

	static readonly osnapPointRefClassName = 'AcDbOsnapPointRef';
}

export { AssociativityFlags } from './AssociativityFlags.js';

export { RotatedDimensionType } from './RotatedDimensionType.js';

export { ObjectOsnapType } from './ObjectOsnapType.js';
