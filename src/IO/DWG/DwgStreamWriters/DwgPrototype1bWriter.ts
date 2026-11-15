import { ModelerGeometry } from '../../../Entities/ModelerGeometry.js';

/** Byte-oriented AcDs storage (ODA specification, chapter 24). */
class StorageBytes {
	private _bytes = new Uint8Array(128);
	private _length = 0;
	get bytes(): Uint8Array { return this._bytes.subarray(0, this._length); }
	private _reserve(count: number): void {
		if (this._length + count <= this._bytes.length) return;
		const bytes = new Uint8Array(Math.max(this._length + count, this._bytes.length * 2));
		bytes.set(this.bytes);
		this._bytes = bytes;
	}
	uint16(value: number): void {
		this._reserve(2);
		this._bytes[this._length++] = value;
		this._bytes[this._length++] = value >>> 8;
	}
	uint32(value: number): void {
		this._reserve(4);
		for (let i = 0; i < 4; i++) this._bytes[this._length++] = value >>> (8 * i);
	}
	uint64(value: number): void { this.uint32(value); this.uint32(Math.floor(value / 0x100000000)); }
	append(value: ArrayLike<number>): void {
		this._reserve(value.length);
		this._bytes.set(value, this._length);
		this._length += value.length;
	}
	text(value: string): void { this.append(new TextEncoder().encode(value)); this.append([0]); }
	align(size: number, fill: number = 0x55): void {
		const padding = (size - this._length % size) % size;
		this._reserve(padding);
		this._bytes.fill(fill, this._length, this._length + padding);
		this._length += padding;
	}
}

/** Stores modeler payloads by entity handle, including the search index ODA needs. */
export class DwgPrototype1bWriter {
	static write(geometry: readonly ModelerGeometry[]): Uint8Array {
		geometry = [...geometry].sort((a, b) => a.handle - b.handle);
		// A blob page plus its 48-byte segment and 32-byte page headers fits 1 MiB.
		const pageSize = 0xfffb0;
		let segmentCount = 6;
		const records = geometry.map(entity => {
			const count = entity.binaryData.length > 0x40000 ? Math.ceil(entity.binaryData.length / pageSize) : 0;
			const pages = Array.from({ length: count }, (_, index) => ({
				segmentIndex: segmentCount++, offset: index * pageSize,
				size: Math.min(pageSize, entity.binaryData.length - index * pageSize),
			}));
			return { entity, pages, size: count ? 36 + count * 8 : 4 + entity.binaryData.length };
		});
		const segments: Uint8Array[] = [];
		const segment = (name: string, body: StorageBytes, systemOffset = 0, objectOffset = 0, blob = false) => {
			const size = Math.ceil((48 + body.bytes.length) / 64) * 64;
			const header = new StorageBytes();
			header.uint16(0xd5ac);
			header.append(new TextEncoder().encode(name));
			header.uint32(segments.length);
			header.uint32(blob ? 1 : 0);
			header.uint32(size);
			header.uint32(0);
			header.uint32(1); // Storage revision.
			header.uint32(0);
			header.uint32(systemOffset);
			header.uint32(objectOffset);
			header.append(new Uint8Array(8).fill(0x55));
			header.append(body.bytes);
			header.align(64, 0x70);
			segments.push(header.bytes);
		};
		const index = new StorageBytes();
		for (let i = 0; i < segmentCount; i++) { index.uint64(0); index.uint32(0); }
		segment('segidx', index); // Filled after all segment sizes are known.

		const schemas = new StorageBytes();
		const schemaNames = ['AcDb3DSolid_ASM_Data', 'AcDbDs::TreatedAsObjectDataSchema',
			'AcDbDs::LegacySchema', 'AcDbDs::IndexedPropertySchema', 'AcDbDs::HandleAttributeSchema'];
		const schemaData = new StorageBytes();
		for (let i = 0; i < 4; i++) { schemaData.uint32(8); schemaData.uint32(i === 3 ? 0 : 1); }
		const schemaOffsets = [schemaData.bytes.length];
		schemaData.uint16(2); schemaData.uint64(0); schemaData.uint64(1); schemaData.uint16(2);
		schemaData.uint32(0); schemaData.uint32(0); schemaData.uint32(10);
		schemaData.uint16(2); schemaData.uint64(2); schemaData.uint64(3);
		schemaData.uint32(0); schemaData.uint32(1); schemaData.uint32(15); schemaData.uint16(0);
		for (let i = 1; i < schemaNames.length; i++) {
			schemaOffsets.push(schemaData.bytes.length);
			schemaData.uint16(0); schemaData.uint16(1);
			schemaData.uint32(i === 4 ? 8 : 0); schemaData.uint32(i + 1); schemaData.uint32(i === 4 ? 7 : 1);
			if (i === 4) schemaData.uint32(1);
			schemaData.uint16(i === 4 ? 1 : 0);
			if (i === 4) schemaData.append([0]);
		}
		schemas.uint32(schemaNames.length); schemas.uint32(0);
		for (let i = 0; i < schemaNames.length; i++) {
			schemas.uint32(i); schemas.uint32(2); schemas.uint32(schemaOffsets[i]);
		}
		schemas.uint64(0xaf10c); schemas.uint32(4); schemas.uint32(0);
		for (let i = 0; i < 4; i++) { schemas.uint32(2); schemas.uint32(i * 8); schemas.uint32(i); }
		schemas.align(16);
		const schemaNamesOffset = (48 + schemas.bytes.length) / 16;
		schemas.uint32(schemaNames.length);
		for (const name of schemaNames) schemas.text(name);
		segment('schidx', schemas, schemaNamesOffset);

		schemaData.align(16);
		const propertyNamesOffset = (48 + schemaData.bytes.length) / 16;
		schemaData.uint32(6);
		for (const name of ['AcDbDs::ID', 'ASM_Data', 'AcDbDs::TreatedAsObjectData',
			'AcDbDs::Legacy', 'AcDs:Indexable', 'AcDbDs::HandleAttribute']) schemaData.text(name);
		segment('schdat', schemaData, propertyNamesOffset);

		const dataIndex = new StorageBytes();
		dataIndex.uint32(geometry.length); dataIndex.uint32(0);
		for (let i = 0; i < geometry.length; i++) {
			dataIndex.uint32(4); dataIndex.uint32(i * 20); dataIndex.uint32(0);
		}
		segment('datidx', dataIndex);

		const data = new StorageBytes();
		let localOffset = 0;
		for (const { entity, size } of records) {
			data.uint32(20); data.uint32(1); data.uint64(entity.handle); data.uint32(localOffset);
			localOffset += size;
		}
		data.align(16);
		const objectOffset = (48 + data.bytes.length) / 16;
		for (const { entity, pages, size } of records) {
			if (pages.length === 0) {
				data.uint32(entity.binaryData.length); data.append(entity.binaryData);
			} else {
				data.uint32(0xbb106bb1);
				data.uint64(entity.binaryData.length); data.uint32(pages.length);
				data.uint32(size); data.uint32(pageSize); data.uint32(pages[pages.length - 1].size);
				data.uint32(0); data.uint32(0);
				for (const page of pages) { data.uint32(page.segmentIndex); data.uint32(page.size); }
			}
		}
		segment('_data_', data, 0, objectOffset);

		const search = new StorageBytes();
		search.uint32(1); search.uint32(0); search.uint64(geometry.length);
		for (let i = 0; i < geometry.length; i++) search.uint64(i);
		search.uint32(1); search.uint32(0); search.uint32(geometry.length);
		for (const [i, entity] of geometry.entries()) {
			search.uint64(entity.handle); search.uint64(1); search.uint64(i);
		}
		segment('search', search);

		for (const { entity, pages } of records) {
			for (const [index, page] of pages.entries()) {
				const body = new StorageBytes();
				body.uint64(entity.binaryData.length); body.uint64(page.offset);
				body.uint32(index); body.uint32(pages.length); body.uint64(page.size);
				body.append(entity.binaryData.subarray(page.offset, page.offset + page.size));
				segment('blob01', body, 0, 0, true);
			}
		}

		let size = 128;
		const offsets = segments.map(bytes => { const offset = size; size += bytes.length; return offset; });
		const output = new Uint8Array(size).fill(0x55);
		const view = new DataView(output.buffer);
		const fields = [0x6472616a, 0x10080, 8, 2, 0, 1, offsets[0], 0, segments.length, 1, 3, 5, 0, size];
		fields.forEach((value, i) => view.setUint32(i * 4, value, true));
		output.fill(0, fields.length * 4, fields.length * 4 + 16);
		segments.forEach((bytes, i) => output.set(bytes, offsets[i]));
		offsets.forEach((offset, i) => {
			view.setBigUint64(offsets[0] + 48 + 12 * i, BigInt(offset), true);
			view.setUint32(offsets[0] + 56 + 12 * i, segments[i].length, true);
		});
		return output;
	}
}
