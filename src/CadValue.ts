import { IHandledCadObject } from './IHandledCadObject.js';
import { ObjectType } from './Types/ObjectType.js';
import { CadValueType } from './CadValueType.js';
import { CadValueUnitType } from './CadValueUnitType.js';

export class CadValue {
	public flags: number = 0;
	public format: string = "";
	public formattedValue: string = "";

	public get isEmpty(): boolean {
		return (this.flags & 1) !== 0;
	}
	public set isEmpty(value: boolean) {
		if (value) {
			this.flags |= 0b1;
		} else {
			this.flags &= ~0b1;
		}
	}

	public units: CadValueUnitType = CadValueUnitType.NoUnits;
	public value: any = null;
	public valueType: CadValueType = CadValueType.Unknown;

	public setValue(value: any, valueType?: CadValueType): void {
		if (valueType !== undefined) {
			this.valueType = valueType;
		}

		switch (this.valueType) {
			case CadValueType.Point2D:
			case CadValueType.Point3D:
			case CadValueType.Long:
			case CadValueType.Double:
			case CadValueType.Date:
			case CadValueType.Handle:
			case CadValueType.String:
			case CadValueType.General:
				this.value = value;
				break;
			case CadValueType.Unknown:
			case CadValueType.Buffer:
			case CadValueType.ResultBuffer:
			default:
				throw new Error("Invalid operation for value type");
		}
	}

	public toString(): string {
		return `${this.valueType}:${this.value}`;
	}
}

export { CadValueUnitType } from './CadValueUnitType.js';

export { CadValueType } from './CadValueType.js';
