import { CadObject } from '../CadObject.js';

export interface IExtendedDataHandleReference {
	value: number;
	resolveReference(document: any /* CadDocument */): CadObject;
}
