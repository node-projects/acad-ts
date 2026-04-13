import { Entity } from './Entity.js';
import { ObjectType } from '../Types/ObjectType.js';

export class UnknownEntity extends Entity {
	override get objectType(): ObjectType {
		return ObjectType.UNDEFINED;
	}

	override get objectName(): string {
		return this._objectName;
	}

	override get subclassMarker(): string {
		return this._subclassMarker;
	}

	private _objectName: string;
	private _subclassMarker: string;

	constructor(dxfClass?: any) {
		super();
		if (dxfClass) {
			this._objectName = dxfClass.dxfName || '';
			this._subclassMarker = dxfClass.cppClassName || '';
		} else {
			this._objectName = '';
			this._subclassMarker = '';
		}
	}

	override applyTransform(transform: any): void {
		// No-op
	}

	override getBoundingBox(): any {
		return null;
	}
}
