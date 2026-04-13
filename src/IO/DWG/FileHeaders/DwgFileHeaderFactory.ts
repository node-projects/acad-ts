import { ACadVersion } from '../../../ACadVersion.js';
import { CadNotSupportedException } from '../../../Exceptions/CadNotSupportedException.js';
import { DwgFileHeader } from './DwgFileHeader.js';
import { DwgFileHeaderAC15 } from './DwgFileHeaderAC15.js';
import { DwgFileHeaderAC18 } from './DwgFileHeaderAC18.js';
import { DwgFileHeaderAC21 } from './DwgFileHeaderAC21.js';

DwgFileHeader.registerFactory((version: ACadVersion): DwgFileHeader | null => {
	switch (version) {
		case ACadVersion.Unknown:
			throw new CadNotSupportedException();
		case ACadVersion.MC0_0:
		case ACadVersion.AC1_2:
		case ACadVersion.AC1_4:
		case ACadVersion.AC1_50:
		case ACadVersion.AC2_10:
		case ACadVersion.AC1002:
		case ACadVersion.AC1003:
		case ACadVersion.AC1004:
		case ACadVersion.AC1006:
		case ACadVersion.AC1009:
			throw new CadNotSupportedException(version);
		case ACadVersion.AC1012:
		case ACadVersion.AC1014:
		case ACadVersion.AC1015:
			return new DwgFileHeaderAC15(version);
		case ACadVersion.AC1018:
			return new DwgFileHeaderAC18(version);
		case ACadVersion.AC1021:
			return new DwgFileHeaderAC21(version);
		case ACadVersion.AC1024:
		case ACadVersion.AC1027:
		case ACadVersion.AC1032:
			return new DwgFileHeaderAC18(version);
		default:
			break;
	}

	return null;
});
