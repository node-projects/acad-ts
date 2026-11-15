import { ACadVersion } from '../../../ACadVersion.js';
import { CadFileDataStorage } from '../../../DataStorage/CadFileDataStorage.js';
import { DwgDocumentBuilder } from '../DwgDocumentBuilder.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { DwgSectionIO } from '../DwgSectionIO.js';
import { NotificationType } from '../../NotificationEventHandler.js';
import { IDwgStreamReader } from './IDwgStreamReader.js';
import { decodeCadString } from '../../TextEncoding.js';
import { AcdsSchema } from '../../../DataStorage/AcdsSchema.js';
import { AcdsSchemaRecord } from '../../../DataStorage/AcdsSchemaRecord.js';
import { SchemaRecordFlags } from '../../../DataStorage/SchemaRecordFlags.js';
import { AcdsRecord } from '../../../DataStorage/AcdsRecord.js';
import { AcdsRecordColumn } from '../../../DataStorage/AcdsRecordColumn.js';

interface FileHeader {
	segmentIndexOffset: number;
	segmentIndexEntryCount: number;
	schemaIndexSegmentIndex: number;
	dataIndexSegmentIndex: number;
}
interface SegmentHeader {
	name: string;
	segmentIndex: number;
	segmentSize: number;
	systemDataAlignmentOffset: number;
	objectDataAlignmentOffset: number;
}
interface SegmentEntry { offset: number; size: number }
interface DataIndexEntry { segmentIndex: number; localOffset: number; schemaIndex: number }
interface SchemaPointer { index: number; segmentIndex: number; localOffset: number }
interface SchemaIndex { header: SegmentHeader; schemaPointers: SchemaPointer[]; propertyPointers: SchemaPointer[]; names: string[] }

export class DwgPrototype1bReader extends DwgSectionIO {
	get sectionName(): string { return DwgSectionDefinition.acDsPrototype; }
	private _fileHeader!: FileHeader;
	private _segments: SegmentEntry[] = [];
	private _schemaIndex!: SchemaIndex;
	private _dataIndex: DataIndexEntry[] = [];

	constructor(version: ACadVersion, private readonly _builder: DwgDocumentBuilder, private readonly _reader: IDwgStreamReader) {
		super(version);
	}

	read(): void {
		const storage = new CadFileDataStorage();
		try {
			this._fileHeader = this._readFileHeader();
			this._readFileSegmentIndex();
			this._schemaIndex = this._readSchemaIndex();
			this._readSchemaData(storage);
			this._readDataIndex();
			this._readDataFields(storage);
			this._builder.dataStorage = storage;
		} catch (error) {
			if (!this._builder.configuration.failsafe) throw error;
			this._builder.notify('An error occurred while reading the Prototype1b', NotificationType.Error, error instanceof Error ? error : new Error(String(error)));
		}
	}

	private _requireBytes(count: number): void {
		if (!Number.isSafeInteger(count) || count < 0 || this._reader.position + count > this._reader.stream.length) {
			throw new Error('Invalid Prototype1b data length or offset');
		}
	}
	private _seek(position: number): void {
		if (!Number.isSafeInteger(position) || position < 0 || position > this._reader.stream.length) throw new Error('Invalid Prototype1b offset');
		this._reader.position = position;
	}
	private _uint(): number { this._requireBytes(4); return this._reader.readUInt(); }
	private _ulong(): number {
		const low = this._uint();
		const high = this._uint();
		const value = high * 0x100000000 + low;
		if (!Number.isSafeInteger(value)) throw new Error('Prototype1b value exceeds safe integer range');
		return value;
	}
	private _bytes(count: number): Uint8Array { this._requireBytes(count); return this._reader.readBytes(count); }
	private _readFileHeader(): FileHeader {
		this._requireBytes(56);
		this._bytes(24);
		const segmentIndexOffset = this._uint();
		this._uint();
		const segmentIndexEntryCount = this._uint();
		const schemaIndexSegmentIndex = this._uint();
		const dataIndexSegmentIndex = this._uint();
		this._bytes(12);
		return { segmentIndexOffset, segmentIndexEntryCount, schemaIndexSegmentIndex, dataIndexSegmentIndex };
	}
	private _readSegmentHeader(): SegmentHeader {
		this._bytes(2);
		const name = new TextDecoder('ascii').decode(this._bytes(6));
		const segmentIndex = this._uint();
		this._uint();
		const segmentSize = this._uint();
		this._bytes(12);
		const systemDataAlignmentOffset = this._uint();
		const objectDataAlignmentOffset = this._uint();
		this._bytes(8);
		return { name, segmentIndex, segmentSize, systemDataAlignmentOffset, objectDataAlignmentOffset };
	}
	private _readFileSegmentIndex(): void {
		this._seek(this._fileHeader.segmentIndexOffset);
		this._readSegmentHeader();
		this._requireBytes(this._fileHeader.segmentIndexEntryCount * 12);
		for (let i = 0; i < this._fileHeader.segmentIndexEntryCount; i++) {
			this._segments.push({ offset: this._ulong(), size: this._uint() });
		}
	}

	private _segmentOffset(index: number): number {
		const segment = this._segments[index];
		if (!segment) throw new Error(`Prototype1b segment ${index} not found`);
		return segment.offset;
	}
	private _readString(): string {
		const bytes: number[] = [];
		for (;;) {
			this._requireBytes(1);
			const value = this._reader.readByte();
			if (value === 0) break;
			bytes.push(value);
		}
		return decodeCadString(new Uint8Array(bytes), this._reader.encoding);
	}
	private _readSchemaIndex(): SchemaIndex {
		const start = this._segmentOffset(this._fileHeader.schemaIndexSegmentIndex);
		this._seek(start);
		const header = this._readSegmentHeader();
		const schema: SchemaIndex = { header, schemaPointers: [], propertyPointers: [], names: [] };
		const count = this._uint();
		this._uint();
		this._requireBytes(count * 12);
		for (let i = 0; i < count; i++) {
			const index = this._uint();
			const segmentIndex = this._uint();
			const localOffset = this._uint();
			schema.schemaPointers.push({ index, segmentIndex, localOffset });
		}
		this._ulong();
		const properties = this._uint();
		this._uint();
		this._requireBytes(properties * 12);
		for (let i = 0; i < properties; i++) {
			const segmentIndex = this._uint();
			const localOffset = this._uint();
			const index = this._uint();
			schema.propertyPointers.push({ index, segmentIndex, localOffset });
		}
		if (header.systemDataAlignmentOffset !== 0) {
			this._seek(start + header.systemDataAlignmentOffset * 16);
			const names = this._uint();
			this._requireBytes(names);
			for (let i = 0; i < names; i++) schema.names.push(this._readString());
		}
		return schema;
	}

	private _ushort(): number {
		this._requireBytes(2);
		return this._reader.readShort() & 0xFFFF;
	}
	private _readSchemaData(storage: CadFileDataStorage): void {
		const indices = new Set([...this._schemaIndex.schemaPointers, ...this._schemaIndex.propertyPointers].map(p => p.segmentIndex));
		for (const index of indices) {
			this._seek(this._segmentOffset(index));
			const header = this._readSegmentHeader();
			const properties = this._schemaIndex.propertyPointers.filter(p => p.segmentIndex === header.segmentIndex);
			this._bytes(properties.length * 8);
			const schemas: AcdsSchema[] = [];
			for (const pointer of this._schemaIndex.schemaPointers.filter(p => p.segmentIndex === header.segmentIndex)) {
				const schema = new AcdsSchema();
				schema.index = pointer.index;
				schema.name = this._schemaIndex.names[pointer.index] ?? '';
				const indexCount = this._ushort();
				this._requireBytes(indexCount * 8);
				for (let i = 0; i < indexCount; i++) schema.indices.push(this._ulong());
				const recordCount = this._ushort();
				for (let i = 0; i < recordCount; i++) schema.embeddedRecords.push(this._readSchemaRecord());
				schemas.push(schema);
			}
			const boundary = this._reader.position % 16;
			if (boundary !== 0) this._bytes(16 - boundary);
			const count = this._uint();
			this._requireBytes(count);
			const names: string[] = [];
			for (let i = 0; i < count; i++) names.push(this._readString());
			for (const schema of schemas) {
				for (const record of schema.embeddedRecords) {
					if (names[record.nameIndex] === undefined) throw new Error('Invalid Prototype1b property name index');
					record.name = names[record.nameIndex];
				}
				storage.schemes.push(schema);
			}
		}
	}
	private _readSchemaRecord(): AcdsSchemaRecord {
		const record = new AcdsSchemaRecord();
		record.flags = this._uint() as SchemaRecordFlags;
		record.nameIndex = this._uint();
		if ((record.flags & SchemaRecordFlags.NoType) === 0) {
			record.type = this._uint();
			record.typeSize = record.type === 0xE ? this._uint() : (AcdsSchemaRecord.typeSizes[record.type] ?? 0);
		}
		if (record.flags === SchemaRecordFlags.Unknown0) record.unknown1 = this._uint();
		else if (record.flags === SchemaRecordFlags.Unknown1) record.unknown2 = this._uint();
		const count = this._ushort();
		if (record.typeSize > 0) {
			this._requireBytes(count * record.typeSize);
			for (let i = 0; i < count; i++) record.values.push(this._bytes(record.typeSize));
		}
		return record;
	}

	private _readDataIndex(): void {
		this._seek(this._segmentOffset(this._fileHeader.dataIndexSegmentIndex));
		this._readSegmentHeader();
		const count = this._uint();
		this._uint();
		this._requireBytes(count * 12);
		for (let i = 0; i < count; i++) {
			const segmentIndex = this._uint();
			const localOffset = this._uint();
			const schemaIndex = this._uint();
			if (segmentIndex !== 0) this._dataIndex.push({ segmentIndex, localOffset, schemaIndex });
		}
	}

	private _readDataFields(storage: CadFileDataStorage): void {
		for (const index of new Set(this._dataIndex.map(e => e.segmentIndex))) {
			const start = this._segmentOffset(index);
			this._seek(start);
			const segment = this._readSegmentHeader();
			if (segment.segmentSize === 0) continue;
			const headerEnd = this._reader.position;
			const entries = this._dataIndex.filter(e => e.segmentIndex === index);
			const headers = entries.map(entry => {
				this._seek(headerEnd + entry.localOffset);
				this._uint();
				this._uint();
				return { entry, handle: this._ulong(), localOffset: this._uint() };
			});
			const dataStart = start + segment.objectDataAlignmentOffset * 16;
			for (let i = 0; i < headers.length; i++) {
				const header = headers[i];
				let next = segment.segmentSize - segment.objectDataAlignmentOffset * 16;
				for (const candidate of headers) {
					if (candidate.localOffset > header.localOffset) next = Math.min(next, candidate.localOffset);
				}
				const maxSize = next - header.localOffset;
				this._seek(dataStart + header.localOffset);
				const size = this._uint();
				if (size + 4 <= maxSize) {
					this._storeData(storage, header.entry.schemaIndex, header.handle, this._bytes(size));
				} else if (size === 0xbb106bb1) {
					const totalSize = this._ulong();
					const pages = this._uint();
					this._bytes(20);
					this._requireBytes(pages * 8);
					const pointers: number[] = [];
					for (let j = 0; j < pages; j++) {
						pointers.push(this._uint());
						this._uint();
					}
					const chunks: Uint8Array[] = [];
					let length = 0;
					for (const pointer of pointers) {
						this._seek(this._segmentOffset(pointer));
						this._readSegmentHeader();
						this._ulong();
						this._ulong();
						this._uint();
						this._uint();
						const pageSize = this._ulong();
						if (pageSize > totalSize - length) throw new Error('Prototype1b blob exceeds declared size');
						const chunk = this._bytes(pageSize);
						chunks.push(chunk);
						length += chunk.length;
					}
					if (length !== totalSize) throw new Error('Incomplete Prototype1b blob');
					const data = new Uint8Array(length);
					let offset = 0;
					for (const chunk of chunks) { data.set(chunk, offset); offset += chunk.length; }
					this._storeData(storage, header.entry.schemaIndex, header.handle, data);
				} else {
					throw new Error('Prototype1b record exceeds its segment');
				}
			}
		}
	}
	private _storeData(storage: CadFileDataStorage, schemaIndex: number, handle: number, data: Uint8Array): void {
		const schema = storage.schemes.find(s => s.index === schemaIndex);
		if (!schema) throw new Error(`Prototype1b schema ${schemaIndex} not found`);
		const record = new AcdsRecord();
		record.index = schemaIndex;
		for (const property of schema.embeddedRecords) {
			const column = new AcdsRecordColumn();
			column.name = property.name;
			column.dataType = property.type;
			if (property.name === CadFileDataStorage.acDbDsId) column.handle = handle;
			else if (property.name === CadFileDataStorage.asmData) column.data = data;
			record.columns.set(column.name, column);
		}
		storage.records.push(record);
	}
}
