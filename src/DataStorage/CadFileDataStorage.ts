import { AcdsSchema } from './AcdsSchema.js';
import { AcdsRecord } from './AcdsRecord.js';

export class CadFileDataStorage {
	records: AcdsRecord[] = [];
	schemes: AcdsSchema[] = [];
}
