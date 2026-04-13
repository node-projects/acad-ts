import { DxfPropertyBase } from './DxfPropertyBase.js';
import { DxfCode } from './DxfCode.js';

export class DxfProperty extends DxfPropertyBase {
	constructor(propertyName: string, dxfCodes: number[]);
	constructor(code: number, propertyName: string, dxfCodes?: number[]);
	constructor(codeOrName: number | string, nameOrCodes: string | number[], dxfCodes?: number[]) {
		if (typeof codeOrName === 'string') {
			super(codeOrName, nameOrCodes as number[]);
		} else {
			super(nameOrCodes as string, dxfCodes ?? [codeOrName]);
			this._assignedCode = codeOrName;
		}
	}

	public getCollectionCodes(): number[] | null {
		// TODO: Requires attribute reflection
		return null;
	}

	public getValue(obj: any): any {
		return this.getRawValue(obj);
	}

	public toString(): string {
		let str = "";
		for (const code of this.dxfCodes) {
			str += `${code}:`;
		}
		str += this._propertyName;
		return str;
	}
}
