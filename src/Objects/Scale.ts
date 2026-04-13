import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

export class Scale extends NonGraphicalObject {
	static readonly DefaultName = '1:1';

	static get Default(): Scale {
		const s = new Scale();
		s.name = Scale.DefaultName;
		s.paperUnits = 1.0;
		s.drawingUnits = 1.0;
		s.isUnitScale = true;
		return s;
	}

	override get objectType(): ObjectType {
		return ObjectType.UNLISTED;
	}

	override get objectName(): string {
		return DxfFileToken.ObjectScale;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.Scale;
	}

	paperUnits: number = 0;
	drawingUnits: number = 0;
	isUnitScale: boolean = false;

	get scaleFactor(): number {
		return this.paperUnits / this.drawingUnits;
	}

	constructor(name?: string) {
		super(name);
	}

	applyTo(value: number): number {
		return value * this.scaleFactor;
	}
}
