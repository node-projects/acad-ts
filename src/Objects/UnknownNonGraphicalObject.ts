import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfClass } from '../Classes/DxfClass.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';

type DxfClassLookupResult = { result: DxfClass | null; found: boolean };

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
			return DxfSubclassMarker.entity;
		}
		return this.dxfClass.cppClassName;
	}

	readonly dxfClass: DxfClass | null;

	constructor(dxfClass: DxfClass | DxfClassLookupResult | null) {
		super();
		this.dxfClass = dxfClass instanceof DxfClass ? dxfClass : dxfClass?.result ?? null;
	}
}
