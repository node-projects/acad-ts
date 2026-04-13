import { DxfCode } from './DxfCode.js';
import { GroupCodeValueType } from './GroupCodeValueType.js';
import { GroupCodeValue } from './GroupCodeValue.js';
import { DxfProperty } from './DxfProperty.js';

export abstract class DxfMapBase {
	public name: string = "";
	public dxfProperties: Map<number, DxfProperty> = new Map();

	// TODO: addClassProperties requires reflection which is not available in TypeScript
	protected static addClassProperties(map: DxfMapBase, type: any, obj?: any): void {
		// TODO: Reflection-based property mapping not directly convertible to TypeScript
	}

	// TODO: cadObjectMapDxf requires reflection
	protected static *cadObjectMapDxf(type: any): IterableIterator<[number, DxfProperty]> {
		// TODO: Reflection-based property iteration not directly convertible to TypeScript
	}
}
