import { describe, it, expect } from 'vitest';
import { GroupCodeValueType } from '../src/GroupCodeValue.js';
import { XYZ } from '../src/Math/XYZ.js';
import { ExtendedDataBinaryChunk } from '../src/XData/ExtendedDataBinaryChunk.js';
import { ExtendedDataCoordinate } from '../src/XData/ExtendedDataCoordinate.js';
import { ExtendedDataHandle } from '../src/XData/ExtendedDataHandle.js';
import { ExtendedDataInteger16 } from '../src/XData/ExtendedDataInteger16.js';
import { ExtendedDataInteger32 } from '../src/XData/ExtendedDataInteger32.js';
import { ExtendedDataReal } from '../src/XData/ExtendedDataReal.js';
import { ExtendedDataRecord } from '../src/XData/ExtendedDataRecord.js';
import { ExtendedDataString } from '../src/XData/ExtendedDataString.js';

describe('ExtendedDataRecordTests', () => {
	it('CreateBuildsConcreteRecordTypes', () => {
		expect(ExtendedDataRecord.create(GroupCodeValueType.Bool, true)).toBeInstanceOf(ExtendedDataInteger16);
		expect(ExtendedDataRecord.create(GroupCodeValueType.Point3D, new XYZ(1, 2, 3))).toBeInstanceOf(ExtendedDataCoordinate);
		expect(ExtendedDataRecord.create(GroupCodeValueType.Handle, 16)).toBeInstanceOf(ExtendedDataHandle);
		expect(ExtendedDataRecord.create(GroupCodeValueType.ObjectId, 16)).toBeInstanceOf(ExtendedDataHandle);
		expect(ExtendedDataRecord.create(GroupCodeValueType.ExtendedDataHandle, 16)).toBeInstanceOf(ExtendedDataHandle);
		expect(ExtendedDataRecord.create(GroupCodeValueType.String, 'value')).toBeInstanceOf(ExtendedDataString);
		expect(ExtendedDataRecord.create(GroupCodeValueType.Comment, 'value')).toBeInstanceOf(ExtendedDataString);
		expect(ExtendedDataRecord.create(GroupCodeValueType.ExtendedDataString, 'value')).toBeInstanceOf(ExtendedDataString);
		expect(ExtendedDataRecord.create(GroupCodeValueType.Chunk, [1, 2, 3])).toBeInstanceOf(ExtendedDataBinaryChunk);
		expect(ExtendedDataRecord.create(GroupCodeValueType.ExtendedDataChunk, new Uint8Array([1, 2, 3]))).toBeInstanceOf(ExtendedDataBinaryChunk);
		expect(ExtendedDataRecord.create(GroupCodeValueType.Double, 1.5)).toBeInstanceOf(ExtendedDataReal);
		expect(ExtendedDataRecord.create(GroupCodeValueType.ExtendedDataDouble, 1.5)).toBeInstanceOf(ExtendedDataReal);
		expect(ExtendedDataRecord.create(GroupCodeValueType.Int16, 12)).toBeInstanceOf(ExtendedDataInteger16);
		expect(ExtendedDataRecord.create(GroupCodeValueType.ExtendedDataInt16, 12)).toBeInstanceOf(ExtendedDataInteger16);
		expect(ExtendedDataRecord.create(GroupCodeValueType.Int32, 12)).toBeInstanceOf(ExtendedDataInteger32);
		expect(ExtendedDataRecord.create(GroupCodeValueType.ExtendedDataInt32, 12)).toBeInstanceOf(ExtendedDataInteger32);
	});

	it('CreateRejectsUnsupportedGroupCodes', () => {
		expect(() => ExtendedDataRecord.create(GroupCodeValueType.Int64, 12n)).toThrow('Unsupported extended data group code');
	});
});