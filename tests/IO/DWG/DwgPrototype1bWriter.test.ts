import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { CadDocument } from '../../../src/CadDocument.js';
import { Solid3D } from '../../../src/Entities/Solid3D.js';
import { Region } from '../../../src/Entities/Region.js';
import { CadBody } from '../../../src/Entities/CadBody.js';
import { ModelerGeometry } from '../../../src/Entities/ModelerGeometry.js';
import { DwgDocumentBuilder } from '../../../src/IO/DWG/DwgDocumentBuilder.js';
import { DwgReaderConfiguration } from '../../../src/IO/DWG/DwgReaderConfiguration.js';
import { DwgStreamReaderAC24 } from '../../../src/IO/DWG/DwgStreamReaders/DwgStreamReaderAC24.js';
import { DwgPrototype1bReader } from '../../../src/IO/DWG/DwgStreamReaders/DwgPrototype1bReader.js';
import { DwgPrototype1bWriter } from '../../../src/IO/DWG/DwgStreamWriters/DwgPrototype1bWriter.js';
import { CadEntityTemplate } from '../../../src/IO/Templates/CadEntityTemplate.js';
import { DwgReader } from '../../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../../src/IO/DWG/DwgWriter.js';

function payload(size: number, seed: number): Uint8Array {
	return Uint8Array.from({ length: size }, (_, i) => (i * 31 + seed) & 255);
}
const digest = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');

describe('AcDs blob writing', () => {
	it.each([
		[ACadVersion.AC1027, false], [ACadVersion.AC1032, false],
		[ACadVersion.AC1027, true], [ACadVersion.AC1032, true],
	] as const)('retains mixed schema associations with unsorted payload offsets in %s (blob=%s)', (version, blob) => {
		const source = [new Region(), new Solid3D(), new Solid3D(), new Solid3D()];
		const builder = new DwgDocumentBuilder(version, new CadDocument(), new DwgReaderConfiguration());
		builder.configuration.failsafe = false;
		for (const [i, entity] of source.entries()) {
			entity.handle = i + 1;
			entity.acisData = payload(blob && i === 2 ? 0x40001 : 32 + i, i);
			const target = new Solid3D(); target.handle = entity.handle;
			if (i > 0) builder.addTemplate(new CadEntityTemplate(target));
		}
		const bytes = DwgPrototype1bWriter.write(source);
		const view = new DataView(bytes.buffer);
		expect(view.getUint32(48, true)).toBe(0); // Absent previous-save index.
		const segmentOffset = (index: number) => Number(view.getBigUint64(128 + 48 + index * 12, true));
		const dataIndex = segmentOffset(3), data = segmentOffset(4);
		const headers = bytes.slice(data + 48, data + 48 + 4 * 20);
		for (const [i, original] of [2, 0, 1, 3].entries()) {
			bytes.set(headers.subarray(original * 20, original * 20 + 20), data + 48 + i * 20);
			view.setUint32(dataIndex + 48 + 8 + i * 12 + 8, original === 0 ? 1 : 0, true);
		}
		new DwgPrototype1bReader(version, builder, new DwgStreamReaderAC24(bytes, false)).read();
		expect(builder.dataStorage!.schemes.map(schema => schema.name)).toEqual([
			'AcDb3DSolid_ASM_Data', 'AcDbDs::TreatedAsObjectDataSchema', 'AcDbDs::LegacySchema',
			'AcDbDs::IndexedPropertySchema', 'AcDbDs::HandleAttributeSchema',
		]);
		expect(builder.dataStorage!.schemes[0].indices).toEqual([0, 1]);
		expect(builder.dataStorage!.schemes[0].embeddedRecords[0].values).toHaveLength(2);
		expect(builder.dataStorage!.records.map(record => record.index)).toEqual([0, 1, 0, 0]);
		builder.buildDataStorage();
		for (const entity of source.slice(1)) expect(builder.tryGetCadObject<ModelerGeometry>(entity.handle)?.acisData).toEqual(entity.acisData);
	});

	it.each([0x3ffff, 0x40000, 0x40001, 0xfffb0, 0xfffb1, 0x1fff60, 0x1fff61])('preserves mixed inline/blob records at payload size %i', size => {
		const source = [new Solid3D(), new Region(), new CadBody()];
		const builder = new DwgDocumentBuilder(ACadVersion.AC1027, new CadDocument(), new DwgReaderConfiguration());
		builder.configuration.failsafe = false;
		for (const [i, entity] of source.entries()) {
			entity.handle = [0x135, 0x123, 0x146][i]; // Deliberately not sorted.
			entity.binaryData = payload(i === 2 ? 97 : size - i, i);
			const target = i === 0 ? new Solid3D() : i === 1 ? new Region() : new CadBody();
			target.handle = entity.handle;
			builder.addTemplate(new CadEntityTemplate(target));
		}
		const bytes = DwgPrototype1bWriter.write(source);
		new DwgPrototype1bReader(ACadVersion.AC1027, builder, new DwgStreamReaderAC24(bytes, false)).read();
		builder.buildDataStorage();
		for (const entity of source) {
			const actual = builder.tryGetCadObject<ModelerGeometry>(entity.handle);
			expect(actual?.constructor).toBe(entity.constructor);
			expect(actual?.binaryData.length).toBe(entity.binaryData.length);
			expect(digest(actual!.binaryData)).toBe(digest(entity.binaryData));
		}
	});

	it.each([ACadVersion.AC1027, ACadVersion.AC1032])('writes and reads solid, region and body blobs in %i', version => {
		const document = new CadDocument();
		document.header.version = version;
		const entities = [new Solid3D(), new Region(), new CadBody()];
		for (const [i, entity] of entities.entries()) {
			entity.binaryData = payload(0xfffb0 + 128 + i, i);
			entity.binaryData.set(new TextEncoder().encode('ASM BinaryFile4'));
			document.entities.add(entity);
		}
		const bytes = DwgWriter.writeToBuffer(document);
		const reread = new DwgReader(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)).read();
		const actual = [...reread.entities].filter((entity): entity is ModelerGeometry => entity instanceof ModelerGeometry);
		const summary = (entity: ModelerGeometry) => ({ type: entity.objectName, handle: entity.handle, size: entity.binaryData.length, hash: digest(entity.binaryData) });
		expect(actual.map(summary)).toEqual(entities.map(summary));
	});
});
