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
	public value: unknown = null;
	public valueType: CadValueType = CadValueType.Unknown;

	public setValue(value: unknown, valueType?: CadValueType): void {
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

	public clone(): CadValue {
		const copy = Object.assign(new CadValue(), this);
		if (this.value && typeof this.value === 'object' && 'handle' in this.value) copy.value = null;
		else if (this.value instanceof Uint8Array) copy.value = this.value.slice();
		else if (this.value instanceof Date) copy.value = new Date(this.value);
		else if (this.value && typeof this.value === 'object' && (this.valueType === CadValueType.Point2D || this.valueType === CadValueType.Point3D)) copy.value = Object.assign(Object.create(Object.getPrototypeOf(this.value)), this.value);
		else if (this.value && typeof this.value === 'object' && 'clone' in this.value && typeof this.value.clone === 'function') copy.value = this.value.clone();
		return copy;
	}
}

export { CadValueUnitType } from './CadValueUnitType.js';

export { CadValueType } from './CadValueType.js';
