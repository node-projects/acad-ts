import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { CadDocument } from '../../../src/CadDocument.js';
import { DwgReader } from '../../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../../src/IO/DWG/DwgWriter.js';
import { Line } from '../../../src/Entities/Line.js';
import { TextEntity } from '../../../src/Entities/TextEntity.js';
import { Insert } from '../../../src/Entities/Insert.js';
import { PolyfaceMesh } from '../../../src/Entities/PolyfaceMesh.js';
import { PolygonMesh } from '../../../src/Entities/PolygonMesh.js';
import { XYZ } from '../../../src/Math/XYZ.js';
import { r2007Crc, r2007ReedSolomon, r2007Seed } from '../../../src/IO/DWG/DwgR2007Encoding.js';
import { DwgLZ77AC21Decompressor } from '../../../src/IO/DWG/DwgStreamReaders/DwgLZ77AC21Decompressor.js';
import { DwgOutputBufferTooSmallError } from '../../../src/Exceptions/DwgOutputBufferTooSmallError.js';
import { BlockRecord } from '../../../src/Tables/BlockRecord.js';
import { CRC } from '../../../src/IO/DWG/CRC.js';

function read(bytes: Uint8Array): CadDocument {
	const reader = new DwgReader(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer);
	reader.configuration.failsafe = false; reader.configuration.crcCheck = true; return reader.read();
}

describe('R12 DWG', () => {
	it('reads independently generated native geometry, attributes and meshes', () => {
		const document = read(readFileSync('samples/legacy/r12-native.dwg'));
		const entities = [...document.entities];
		expect(document.header.version).toBe(ACadVersion.AC1009);
		expect(entities).toHaveLength(8);
		expect((entities[0] as Line).startPoint).toEqual(new XYZ(1, 2, 3));
		const insert = entities.find(e => e instanceof Insert) as Insert;
		expect(insert.block?.name).toBe('LEGACY');
		expect(insert.attributes[0].value).toBe('ABC-123');
		expect((entities.find(e => e instanceof PolygonMesh) as PolygonMesh).vertices).toHaveLength(4);
		expect((entities.find(e => e instanceof PolyfaceMesh) as PolyfaceMesh).faces[0].index3).toBe(-3);
	});
	it('writes legacy strings, radians and native records with unique handles', () => {
		const document = new CadDocument(); document.header.version = ACadVersion.AC1009;
		const text = new TextEntity(); text.value = 'Grüße €'; text.rotation = Math.PI / 3; text.insertPoint = new XYZ(2, 3, 4);
		document.entities.add(text);
		const bytes = DwgWriter.writeToBuffer(document), restored = [...read(bytes).entities][0] as TextEntity;
		expect(new TextDecoder().decode(bytes.subarray(0, 6))).toBe('AC1009');
		expect(restored.value).toBe(text.value); expect(restored.rotation).toBeCloseTo(text.rotation, 12);
		expect(restored.insertPoint).toEqual(text.insertPoint);
		expect(new DwgReader(bytes.buffer as ArrayBuffer).readHeader().version).toBe(ACadVersion.AC1009);
	});
	it('rejects damaged CRCs and truncated sections in strict mode', () => {
		const bytes = new Uint8Array(readFileSync('samples/legacy/r12-native.dwg'));
		bytes[0x100] ^= 1; expect(() => read(bytes)).toThrow(/CRC/);
		expect(() => read(bytes.subarray(0, 100))).toThrow(/Truncated/);
	});
	it('reports output capacity instead of truncating the file', () => {
		const document = new CadDocument(); document.header.version = ACadVersion.AC1009;
		expect(() => DwgWriter.writeToStream(new Uint8Array(1), document)).toThrow(DwgOutputBufferTooSmallError);
	});
	it('keeps anonymous blocks distinct when native table names contain only a prefix', () => {
		const document = new CadDocument(); document.header.version = ACadVersion.AC1009;
		for (let i = 0; i < 2; i++) {
			const block = new BlockRecord('*D' + (i + 1));
			block.entities.add(new Line(new XYZ(i + 1, 2, 3), new XYZ(4, 5, 6)));
			document.blockRecords.add(block); document.entities.add(new Insert(block));
		}
		const bytes = DwgWriter.writeToBuffer(document), view = new DataView(bytes.buffer);
		const size = view.getUint16(44, true), offset = view.getUint32(50, true);
		for (let i = 0; i < 2; i++) {
			const start = offset + i * size; bytes.fill(0, start + 1, start + 33);
			bytes.set(new TextEncoder().encode('*D'), start + 1);
			view.setUint16(start + size - 2, CRC.applyCrc8(0xc0c1, bytes.subarray(start, start + size - 2)), true);
		}
		const inserts = [...read(bytes).entities] as Insert[];
		expect(inserts[0].block).not.toBe(inserts[1].block);
		expect(([...inserts[0].block.entities][0] as Line).startPoint.x).toBe(1);
		expect(([...inserts[1].block.entities][0] as Line).startPoint.x).toBe(2);
	});
});

describe('R2007 DWG', () => {
	it('reproduces native header parity and the two distinct header CRC seeds', () => {
		const native = readFileSync('samples/sample_AC1021.dwg').subarray(0x80, 0x480);
		const decoded = Uint8Array.from({ length: 717 }, (_, i) => native[(i % 239) * 3 + Math.floor(i / 239)]);
		expect(Buffer.from(r2007ReedSolomon(decoded, 239))).toEqual(native.subarray(0, 765));
		const view = new DataView(decoded.buffer), size = view.getInt32(24, true), payload = new Uint8Array(0x110);
		DwgLZ77AC21Decompressor.decompress(decoded, 32, size, payload);
		expect(r2007Crc(decoded.subarray(32, 32 + size), r2007Seed(size, true))).toBe(view.getBigUint64(16, true));
		const pv = new DataView(payload.buffer), expected = pv.getBigUint64(0x108, true); pv.setBigUint64(0x108, 0n, true);
		expect(r2007Crc(payload, r2007Seed(payload.length, true))).toBe(expected);
	});
	it('writes Unicode, summary metadata, repeated maps and multiple object pages', () => {
		const document = new CadDocument(); document.header.version = ACadVersion.AC1021;
		document.summaryInfo.title = 'R2007 日本語 Grüße';
		const text = new TextEntity(); text.value = 'Unicode 日本語 €'; document.entities.add(text);
		for (let i = 0; i < 2500; i++) document.entities.add(new Line(new XYZ(i, 2, 3), new XYZ(i + 1, 5, 6)));
		const bytes = DwgWriter.writeToBuffer(document), restored = read(bytes);
		const header = new DwgReader(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)).readFileHeader();
		expect([...header.descriptors.values()].some(section => section.localSections.some(page => page.compressedSize < page.decompressedSize))).toBe(true);
		const reader = new DwgReader(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
		const history = Reflect.apply(Reflect.get(reader, '_getSectionBuffer21'), reader, [header, 'AcDb:RevHistory']) as Uint8Array;
		expect([...new Uint32Array(history.buffer, history.byteOffset, history.length / 4)]).toEqual([0, 0, 1, 0]);
		expect([...restored.entities]).toHaveLength(2501);
		expect(([...restored.entities][0] as TextEntity).value).toBe(text.value);
		expect(restored.summaryInfo.title).toBe(document.summaryInfo.title);
		expect(bytes.subarray(0x80, 0x480)).toEqual(bytes.subarray(bytes.length - 0x400));
		expect(() => DwgWriter.writeToStream(new Uint8Array(1), document)).toThrow(DwgOutputBufferTooSmallError);
	});
});
