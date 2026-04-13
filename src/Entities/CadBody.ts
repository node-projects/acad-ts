import { ModelerGeometry } from './ModelerGeometry.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { ObjectType } from '../Types/ObjectType.js';

export class CadBody extends ModelerGeometry {
	override get objectType(): ObjectType {
		return ObjectType.BODY;
	}

	override get objectName(): string {
		return DxfFileToken.EntityBody;
	}
}
