import { Entity } from './Entity.js';
import { DxfClass } from '../Classes/DxfClass.js';
import { ObjectType } from '../Types/ObjectType.js';
import type { BoundingBox } from '../Math/BoundingBox.js';

type DxfClassLookupResult = { result: DxfClass | null; found: boolean };

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

	constructor(dxfClass?: DxfClass | DxfClassLookupResult | null) {
		super();
		const resolvedClass = dxfClass instanceof DxfClass
			? dxfClass
			: dxfClass?.result ?? null;
		if (resolvedClass) {
			this._objectName = resolvedClass.dxfName || '';
			this._subclassMarker = resolvedClass.cppClassName || '';
		} else {
			this._objectName = '';
			this._subclassMarker = '';
		}
	}

	override applyTransform(transform: unknown): void {
		// No-op
	}

	override getBoundingBox(): BoundingBox | null {
		return null;
	}
}
