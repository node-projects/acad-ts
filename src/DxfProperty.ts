import { DxfPropertyBase } from './DxfPropertyBase.js';
import { DxfCode } from './DxfCode.js';
import { PropertyMetadata } from './Metadata/MetadataTypes.js';
import { ExtendedDataInteger16 } from './XData/ExtendedDataInteger16.js';
import { ExtendedDataRecord } from './XData/ExtendedDataRecord.js';

export class DxfProperty extends DxfPropertyBase {
	constructor(metadata: PropertyMetadata);
	constructor(code: number, metadata: PropertyMetadata);
	constructor(propertyName: string, dxfCodes: number[]);
	constructor(code: number, propertyName: string, dxfCodes?: number[]);
	constructor(codeOrName: number | string | PropertyMetadata, nameOrCodes?: string | number[] | PropertyMetadata, dxfCodes?: number[]) {
		if (typeof codeOrName === 'object') {
			super(codeOrName);
		} else if (typeof codeOrName === 'string') {
			super(codeOrName, nameOrCodes as number[]);
		} else if (typeof nameOrCodes === 'object' && !Array.isArray(nameOrCodes)) {
			super(nameOrCodes);
			if (!nameOrCodes.valueCodes.includes(codeOrName)) {
				throw new Error(`The property ${nameOrCodes.propertyName} does not have a mapping for code ${codeOrName}`);
			}
			this._assignedCode = codeOrName;
		} else {
			super(nameOrCodes as string, dxfCodes ?? [codeOrName]);
			this._assignedCode = codeOrName;
		}
	}

	public getCollectionCodes(): number[] | null {
		return this._collectionCodes ? [...this._collectionCodes] : null;
	}

	public getValue(obj: object): unknown {
		return this.getPropertyValue(obj);
	}

	public toXDataRecords(): ExtendedDataRecord[] {
		if (this.storedValue === null || this.storedValue === undefined) {
			return [];
		}

		return [
			new ExtendedDataInteger16(this.assignedCode),
			ExtendedDataRecord.create(this.groupCode, this.storedValue),
		];
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
