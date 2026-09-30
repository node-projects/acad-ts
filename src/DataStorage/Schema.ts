import { SchemaProperty } from './SchemaProperty.js';

export class Schema {
	index: number = 0;
	indexes: number[] = [];
	name: string = '';
	properties: SchemaProperty[] = [];
}
