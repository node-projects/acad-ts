import { DxfSectionReaderBase } from './DxfSectionReaderBase.js';
import { IDxfStreamReader } from './IDxfStreamReader.js';
import { DxfDocumentBuilder } from '../DxfDocumentBuilder.js';
import { DxfCode } from '../../../DxfCode.js';
import { DxfFileToken } from '../../../DxfFileToken.js';

export class DxfAcdsDataSectionReader extends DxfSectionReaderBase {
	constructor(reader: IDxfStreamReader, builder: DxfDocumentBuilder) {
		super(reader, builder);
	}

	read(): void {
		this._reader.readNext();
		let inRecord = false;
		let handle = 0;
		let chunks: Uint8Array[] = [];
		const store = (): void => {
			if (!handle || chunks.length === 0) return;
			const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
			const payload = new Uint8Array(length);
			let offset = 0;
			for (const chunk of chunks) { payload.set(chunk, offset); offset += chunk.length; }
			(this._builder as DxfDocumentBuilder).acdsDataRecords.set(handle, payload);
		};

		while (this._reader.valueAsString !== DxfFileToken.endSection) {
			if (this._reader.dxfCode === DxfCode.Start) {
				store();
				inRecord = this._reader.valueAsString === DxfFileToken.acdsRecord;
				handle = 0;
				chunks = [];
			} else if (inRecord) {
				if (this._reader.code === 320) handle = this._reader.valueAsHandle;
				else if (this._reader.code === 310) chunks.push(this._reader.valueAsBinaryChunk);
			}
			this._reader.readNext();
		}
		store();
	}
}
