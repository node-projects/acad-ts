import { AcdsRecordColumn } from './AcdsRecordColumn.js';

export class AcdsRecord {
	index: number = 0;
	columns: Map<string, AcdsRecordColumn> = new Map();

	toString(): string {
		return `${this.index} : ${this.constructor.name}`;
	}
}
