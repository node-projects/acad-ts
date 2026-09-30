import { SchemaProperty } from './SchemaProperty.js';
import { AcdsRecord } from './AcdsRecord.js';

export class Schema {
	embeddedRecords: AcdsRecord[] = [];
	index: number = 0;
	indexes: number[] = [];
	name: string = '';
	properties: SchemaProperty[] = [];
}
