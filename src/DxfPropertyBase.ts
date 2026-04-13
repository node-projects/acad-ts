import { DxfCode } from './DxfCode.js';
import { GroupCodeValueType } from './GroupCodeValueType.js';
import { GroupCodeValue } from './GroupCodeValue.js';

// TODO: DxfPropertyBase relies heavily on C# reflection (PropertyInfo, Attributes)
// This is a simplified version that stores the property mapping data

export abstract class DxfPropertyBase {
	public get assignedCode(): number {
		if (this._assignedCode !== null) return this._assignedCode;
		if (this.dxfCodes.length === 1) return this.dxfCodes[0];
		return DxfCode.Invalid;
	}

	public dxfCodes: number[] = [];
	public referenceType: number = 0; // DxfReferenceType

	public storedValue: any = null;

	public get groupCode(): GroupCodeValueType {
		const code = this.dxfCodes[0];
		return GroupCodeValue.transformValue(code);
	}

	protected _assignedCode: number | null = null;
	protected _propertyName: string = "";

	constructor(propertyName: string, dxfCodes: number[]) {
		this._propertyName = propertyName;
		this.dxfCodes = dxfCodes;
	}

	public setValue(code: number, obj: any, value: any): void {
		// TODO: Simplified - full implementation requires reflection
		if (obj && this._propertyName) {
			obj[this._propertyName] = value;
		}
	}

	public getRawValue(obj: any): any {
		// TODO: Simplified - full implementation requires reflection
		if (obj && this._propertyName) {
			return obj[this._propertyName];
		}
		return null;
	}
}
