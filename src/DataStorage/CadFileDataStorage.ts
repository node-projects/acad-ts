import { AcdsSchema } from './AcdsSchema.js';
import { AcdsRecord } from './AcdsRecord.js';

export class CadFileDataStorage {
	static readonly id = 'AcDbDs::ID';
	static readonly asmData = 'ASM_Data';

	records: AcdsRecord[] = [];
	schemes: AcdsSchema[] = [];
}
