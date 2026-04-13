import { GroupCodeValueType } from '../GroupCodeValue.js';
import { XYZ } from '../Math/XYZ.js';
import { ExtendedDataBinaryChunk } from './ExtendedDataBinaryChunk.js';
import { ExtendedDataCoordinate } from './ExtendedDataCoordinate.js';
import { ExtendedDataHandle } from './ExtendedDataHandle.js';
import { ExtendedDataInteger16 } from './ExtendedDataInteger16.js';
import { ExtendedDataInteger32 } from './ExtendedDataInteger32.js';
import { ExtendedDataReal } from './ExtendedDataReal.js';
import { ExtendedDataRecord } from './ExtendedDataRecordBase.js';
import { ExtendedDataString } from './ExtendedDataString.js';

ExtendedDataRecord.create = function createExtendedDataRecord(groupCode: GroupCodeValueType, value: unknown): ExtendedDataRecord {
	switch (groupCode) {
		case GroupCodeValueType.Bool:
			return new ExtendedDataInteger16(value === true ? 1 : 0);
		case GroupCodeValueType.Point3D:
			return new ExtendedDataCoordinate(value as XYZ);
		case GroupCodeValueType.Handle:
		case GroupCodeValueType.ObjectId:
		case GroupCodeValueType.ExtendedDataHandle:
			return new ExtendedDataHandle(Number(value));
		case GroupCodeValueType.String:
		case GroupCodeValueType.Comment:
		case GroupCodeValueType.ExtendedDataString:
			return new ExtendedDataString(String(value));
		case GroupCodeValueType.Chunk:
		case GroupCodeValueType.ExtendedDataChunk:
			return new ExtendedDataBinaryChunk(value instanceof Uint8Array ? value : new Uint8Array(value as number[]));
		case GroupCodeValueType.Double:
		case GroupCodeValueType.ExtendedDataDouble:
			return new ExtendedDataReal(Number(value));
		case GroupCodeValueType.Int16:
		case GroupCodeValueType.ExtendedDataInt16:
			return new ExtendedDataInteger16(Number(value));
		case GroupCodeValueType.Int32:
		case GroupCodeValueType.ExtendedDataInt32:
			return new ExtendedDataInteger32(Number(value));
		case GroupCodeValueType.None:
		case GroupCodeValueType.Byte:
		case GroupCodeValueType.Int64:
		default:
			throw new Error(`Unsupported extended data group code: ${groupCode}`);
	}
};