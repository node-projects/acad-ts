import { AcdsSchemaProperty } from './AcdsSchemaProperty.js';
import { AcdsSchemaRecord } from './AcdsSchemaRecord.js';

export class AcdsSchema {
	embeddedRecords: AcdsSchemaRecord[] = [];
	index: number = 0;
	indexes: number[] = [];
	name: string = '';
	properties: AcdsSchemaProperty[] = [];
}
