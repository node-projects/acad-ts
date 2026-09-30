import { DxfSectionReaderBase } from './DxfSectionReaderBase.js';
import { IDxfStreamReader } from './IDxfStreamReader.js';
import { DxfDocumentBuilder } from '../DxfDocumentBuilder.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfFileToken } from '../../../DxfFileToken.js';
import { CadFileDataStorage } from '../../../DataStorage/CadFileDataStorage.js';
import { Schema } from '../../../DataStorage/Schema.js';
import { SchemaProperty } from '../../../DataStorage/SchemaProperty.js';
import { SchemaPropertyFlags } from '../../../DataStorage/SchemaPropertyFlags.js';
import { AcdsRecord } from '../../../DataStorage/AcdsRecord.js';

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
					this._readRawRecord();
					continue;
				default:
					this._reader.readNext();
					break;
			}
		}
	}

	private _readRawRecord(): void {
		let handle = 0;
		const chunks: Uint8Array[] = [];
		this._reader.readNext();

		while (this._reader.dxfCode !== DxfCode.Start) {
			if (this._reader.code === 320) handle = this._reader.valueAsHandle;
			else if (this._reader.code === 310) chunks.push(this._reader.valueAsBinaryChunk);
			this._reader.readNext();
		}

		if (!handle || chunks.length === 0) return;
		const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
		const payload = new Uint8Array(length);
		let offset = 0;
		for (const chunk of chunks) {
			payload.set(chunk, offset);
			offset += chunk.length;
		}
		(this._builder as DxfDocumentBuilder).acdsDataRecords.set(handle, payload);
	}

	private _readSchema(): Schema {
		const schema = new Schema();
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

	private _readProperty(): SchemaProperty {
		const property = new SchemaProperty();
		property.name = this._reader.valueAsString;

		while (this._reader.dxfCode !== DxfCode.Start && this._reader.dxfCode !== DxfCode.EmbeddedObjectStart) {
			switch (this._reader.code) {
				case 91:
					property.type = this._reader.valueAsShort;
					break;
				case 280:
					property.propertyFlags = this._reader.valueAsShort as SchemaPropertyFlags;
					break;
			}
			this._reader.readNext();
		}

		return property;
	}

	private _readEmbeddedRecord(): AcdsRecord {
		const record = new AcdsRecord();
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
