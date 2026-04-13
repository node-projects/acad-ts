import { NonGraphicalObject } from './NonGraphicalObject.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';

export class UnknownNonGraphicalObject extends NonGraphicalObject {
	override get objectType(): ObjectType {
		return ObjectType.UNDEFINED;
	}

	override get objectName(): string {
		if (!this.dxfClass) {
			return 'UNKNOWN';
		}
		return this.dxfClass.dxfName;
	}

	override get subclassMarker(): string {
		if (!this.dxfClass) {
			return DxfSubclassMarker.Entity;
		}
		return this.dxfClass.cppClassName;
	}

	readonly dxfClass: any;

	constructor(dxfClass: any) {
		super();
		this.dxfClass = dxfClass;
	}
}
