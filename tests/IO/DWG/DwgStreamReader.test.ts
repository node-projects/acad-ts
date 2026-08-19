import { describe, expect, it } from 'vitest';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { DxfClassCollection } from '../../../src/Classes/DxfClassCollection.js';
import { DwgObjectReader } from '../../../src/IO/DWG/DwgStreamReaders/DwgObjectReader.js';
import { DwgStreamReaderBase } from '../../../src/IO/DWG/DwgStreamReaders/DwgStreamReaderBase.js';
import '../../../src/IO/DWG/DwgStreamReaders/DwgStreamReaderFactory.js';

describe('DwgStreamReader', () => {
	it('resets the empty text-stream state when repositioned to a present stream', () => {
		const stream = new Uint8Array([0, 0, 0, 0x80]);
		const reader = DwgStreamReaderBase.getStreamHandler(ACadVersion.AC1024, stream);

		reader.setPositionByFlag(0);
		expect(reader.isEmpty).toBe(true);

		reader.setPositionByFlag(24);
		expect(reader.isEmpty).toBe(false);
	});

	it('queues each mapped object handle at most once', () => {
		const stream = DwgStreamReaderBase.getStreamHandler(ACadVersion.AC1024, new Uint8Array(32));
		const builder = { tryGetObjectTemplate: () => null };
		const objectReader = new DwgObjectReader(
			ACadVersion.AC1024,
			builder as any,
			stream,
			[1],
			new Map([[1, 0], [2, 8], [3, 16]]),
			new DxfClassCollection(),
		);

		(objectReader as any)._enqueueHandle(2);
		(objectReader as any)._enqueueHandle(2);
		(objectReader as any)._enqueueHandle(3);
		(objectReader as any)._enqueueHandle(4);

		expect((objectReader as any)._handles).toEqual([1, 2, 3]);
	});
});
