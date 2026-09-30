import { DxfSectionReaderBase } from './DxfSectionReaderBase.js';
import { IDxfStreamReader } from './IDxfStreamReader.js';
import { DxfDocumentBuilder } from '../DxfDocumentBuilder.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { CadFileDataStorage } from '../../../DataStorage/CadFileDataStorage.js';
import { AcdsSchema } from '../../../DataStorage/AcdsSchema.js';
import { AcdsSchemaProperty } from '../../../DataStorage/AcdsSchemaProperty.js';
import { AcdsSchemaPropertyFlags } from '../../../DataStorage/AcdsSchemaPropertyFlags.js';
import { AcdsSchemaRecord } from '../../../DataStorage/AcdsSchemaRecord.js';
import { AcdsRecord } from '../../../DataStorage/AcdsRecord.js';
import { AcdsRecordColumn } from '../../../DataStorage/AcdsRecordColumn.js';
import { NotificationType } from '../../NotificationEventHandler.js';

export class DxfAcdsDataSectionReader extends DxfSectionReaderBase {
	constructor(reader: IDxfStreamReader, builder: DxfDocumentBuilder) {
		super(reader, builder);
	}

	read(): void {
		this._builder.dataStorage = new CadFileDataStorage();
		this._reader.readNext();

		while (this._reader.valueAsString !== DxfFileToken.endSection) {
			if (this._reader.dxfCode !== DxfCode.Start) {
				this._reader.readNext();
				continue;
			}

			switch (this._reader.valueAsString.toUpperCase()) {
				case DxfFileToken.acdsSchema:
					this._builder.dataStorage.schemes.push(this._readSchema());
					continue;
				case DxfFileToken.acdsRecord:
					this._builder.dataStorage.records.push(this._readAcdsRecord());
					continue;
				default:
					this._reader.readNext();
					break;
			}
		}
	}

	private _readAcdsRecord(): AcdsRecord {
		const record = new AcdsRecord();
		let directHandle = 0;
		const directChunks: Uint8Array[] = [];
		this._reader.readNext();

		while (this._reader.dxfCode !== DxfCode.Start && this._reader.dxfCode !== DxfCode.EmbeddedObjectStart) {
			if (this._reader.code === 2) {
				const column = this._readAcdsRecordColumn();
				if (record.columns.has(column.name)) {
					this._builder.notify(`Duplicate column name '${column.name}' found in ACDS record.`, NotificationType.Warning);
				} else {
					record.columns.set(column.name, column);
				}
				continue;
			} else if (this._reader.code === 90) record.index = this._reader.valueAsInt;
			else if (this._reader.code === 320) directHandle = this._reader.valueAsHandle;
			else if (this._reader.code === 310) directChunks.push(this._reader.valueAsBinaryChunk);
			this._reader.readNext();
		}

		if (directHandle && directChunks.length > 0) {
			const idColumn = new AcdsRecordColumn();
			idColumn.name = CadFileDataStorage.id;
			idColumn.code = 320;
			idColumn.value = directHandle;
			record.columns.set(idColumn.name, idColumn);

			const dataColumn = new AcdsRecordColumn();
			dataColumn.name = CadFileDataStorage.asmData;
			dataColumn.code = 310;
			dataColumn.value = this._combineChunks(directChunks);
			record.columns.set(dataColumn.name, dataColumn);
		}

		return record;
	}

	private _readAcdsRecordColumn(): AcdsRecordColumn {
		const column = new AcdsRecordColumn();
		column.name = this._reader.valueAsString;
		this._reader.readNext();

		while (
			this._reader.dxfCode !== DxfCode.Start
			&& this._reader.dxfCode !== DxfCode.ShapeName
			&& this._reader.dxfCode !== DxfCode.EmbeddedObjectStart
		) {
			if (this._reader.code === 280) {
				column.dataType = this._reader.valueAsShort;
			} else if (this._reader.code === 310 && column.code === 310 && column.value instanceof Uint8Array) {
				column.value = this._combineChunks([column.value, this._reader.valueAsBinaryChunk]);
			} else {
				column.code = this._reader.code;
				column.value = this._reader.value;
			}
			this._reader.readNext();
		}

		return column;
	}

	private _combineChunks(chunks: Uint8Array[]): Uint8Array {
		const payload = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
		let offset = 0;
		for (const chunk of chunks) {
			payload.set(chunk, offset);
			offset += chunk.length;
		}
		return payload;
	}

	private _readSchema(): AcdsSchema {
		const schema = new AcdsSchema();
		this._reader.readNext();

		while (this._reader.dxfCode !== DxfCode.Start) {
			switch (this._reader.code) {
				case 1:
					schema.name = this._reader.valueAsString;
					break;
				case 2:
					schema.properties.push(this._readProperty());
					continue;
				case 90:
					schema.index = this._reader.valueAsInt;
					break;
				case DxfCode.EmbeddedObjectStart:
					if (this._reader.valueAsString === DxfFileToken.acdsRecord) {
						schema.embeddedRecords.push(this._readEmbeddedRecord());
					} else {
						this._skipEmbeddedObject();
					}
					continue;
			}
			this._reader.readNext();
		}

		return schema;
	}

	private _readProperty(): AcdsSchemaProperty {
		const property = new AcdsSchemaProperty();
		property.name = this._reader.valueAsString;

		while (this._reader.dxfCode !== DxfCode.Start && this._reader.dxfCode !== DxfCode.EmbeddedObjectStart) {
			switch (this._reader.code) {
				case 91:
					property.type = this._reader.valueAsShort;
					break;
				case 280:
					property.propertyFlags = this._reader.valueAsShort as AcdsSchemaPropertyFlags;
					break;
			}
			this._reader.readNext();
		}

		return property;
	}

	private _readEmbeddedRecord(): AcdsSchemaRecord {
		const record = new AcdsSchemaRecord();
		this._reader.readNext();

		while (this._reader.dxfCode !== DxfCode.Start && this._reader.dxfCode !== DxfCode.EmbeddedObjectStart) {
			switch (this._reader.code) {
				case 2:
					record.name = this._reader.valueAsString;
					break;
				case 90:
					record.index = this._reader.valueAsInt;
					break;
				case 95:
					record.id = this._reader.valueAsShort;
					break;
				case 280:
					record.value280 = this._reader.valueAsShort;
					break;
				case 291:
					record.value291 = this._reader.valueAsShort;
					break;
			}
			this._reader.readNext();
		}

		return record;
	}

	private _skipEmbeddedObject(): void {
		this._reader.readNext();
		while (this._reader.dxfCode !== DxfCode.Start && this._reader.dxfCode !== DxfCode.EmbeddedObjectStart) {
			this._reader.readNext();
		}
	}
}
