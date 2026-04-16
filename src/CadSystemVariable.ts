import { DxfPropertyBase } from './DxfPropertyBase.js';
import { DxfReferenceType } from './Types/DxfReferenceType.js';
import { SystemVariableMetadata } from './Metadata/MetadataTypes.js';

export class CadSystemVariable extends DxfPropertyBase {
	public name: string;
	public dxfCodes: number[] = [];
	public isName: boolean = false;

	constructor(metadata: SystemVariableMetadata);
	constructor(propertyName: string, name: string, dxfCodes?: number[]);
	constructor(propertyNameOrMetadata: string | SystemVariableMetadata, name?: string, dxfCodes: number[] = []) {
		if (typeof propertyNameOrMetadata === 'string') {
			super(propertyNameOrMetadata, dxfCodes);
			this.name = name ?? propertyNameOrMetadata;
			this.dxfCodes = [...dxfCodes];
			this.isName = false;
			this.referenceType = 0;
		} else {
			super(propertyNameOrMetadata);
			this.name = propertyNameOrMetadata.name;
			this.dxfCodes = [...propertyNameOrMetadata.valueCodes];
			this.isName = propertyNameOrMetadata.isName;
			this.referenceType = propertyNameOrMetadata.referenceType;
		}
	}

	public getSystemValue(code: number, header: object): unknown {
		switch (this.referenceType) {
			case DxfReferenceType.Unprocess:
				return this.getValue(header);
			case DxfReferenceType.Handle:
				return this.getHandledValue(header);
			case DxfReferenceType.Name:
				return this.getNamedValue(header);
			case DxfReferenceType.Count:
				return this.getCounterValue(header);
			case DxfReferenceType.None:
			default:
				return this.getRawValueByCode(code, header);
		}
	}

	public getValue(header: object): unknown {
		return this.getPropertyValue(header);
	}
}
