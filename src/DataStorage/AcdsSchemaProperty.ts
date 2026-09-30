import { AcdsSchemaPropertyFlags } from './AcdsSchemaPropertyFlags.js';

export class AcdsSchemaProperty {
	static readonly typeSizes = [0, 0, 2, 1, 2, 4, 8, 1, 2, 4, 8, 4, 8, 0, 0, 0];

	name: string = '';
	nameIndex: number = 0;
	propertyFlags: AcdsSchemaPropertyFlags = AcdsSchemaPropertyFlags.None;
	propertyValueCount: number = 0;
	type: number | null = null;
	typeSize: number = 0;
	unknown1: number = 0;
	unknown2: number = 0;
	values: Uint8Array[] = [];

	toString(): string {
		return this.name;
	}
}
