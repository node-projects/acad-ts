// TODO: CadSystemVariable relies heavily on C# reflection (PropertyInfo, Attributes)
// This is a simplified TypeScript version

export class CadSystemVariable {
	public name: string;
	public DxfCodes: number[] = [];
	private _propertyName: string;
	private _referenceType: number = 0;

	public get referenceType(): number {
		return this._referenceType;
	}

	public set referenceType(value: number) {
		this._referenceType = value;
	}

	constructor(propertyName: string, name: string) {
		this._propertyName = propertyName;
		this.name = name;
	}

	public getSystemValue(code: number, header: any): any {
		// TODO: Full implementation requires reflection
		if (header && this._propertyName) {
			return header[this._propertyName];
		}
		return null;
	}

	public getValue(header: any): any {
		if (header && this._propertyName) {
			return header[this._propertyName];
		}
		return null;
	}
}
