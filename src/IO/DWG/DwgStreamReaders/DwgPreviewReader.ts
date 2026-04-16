import { ACadVersion } from '../../../ACadVersion.js';
import { DwgPreview } from '../../../DwgPreview.js';
import { DwgSectionIO } from '../DwgSectionIO.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { IDwgStreamReader } from './IDwgStreamReader.js';

export class DwgPreviewReader extends DwgSectionIO {
	override get sectionName(): string {
		return DwgSectionDefinition.preview;
	}

	private readonly _startSentinel: Uint8Array = DwgSectionDefinition.startSentinels.get(DwgSectionDefinition.preview)!;
	private readonly _endSentinel: Uint8Array = DwgSectionDefinition.endSentinels.get(DwgSectionDefinition.preview)!;

	private readonly _reader: IDwgStreamReader;
	private readonly _previewAddress: number;

	constructor(version: ACadVersion, reader: IDwgStreamReader, previewAddress: number) {
		super(version);
		this._reader = reader;
		this._previewAddress = previewAddress;
	}

	public read(): DwgPreview {
		const sentinel: Uint8Array = this._reader.readSentinel();
		console.assert(DwgSectionIO.checkSentinel(sentinel, this._startSentinel));

		const overallSize: number = this._reader.readRawLong();
		const imagespresent: number = this._reader.readRawChar() & 0xFF;

		let headerDataStart: number | null = null;
		let headerDataSize: number | null = null;
		let startOfImage: number | null = null;
		let sizeImage: number | null = null;

		let previewCode: DwgPreview.PreviewType = DwgPreview.PreviewType.Unknown;
		for (let i = 0; i < imagespresent; i++) {
			const code: number = this._reader.readRawChar() & 0xFF;
			switch (code) {
				case 1:
					headerDataStart = this._reader.readRawLong();
					headerDataSize = this._reader.readRawLong();
					break;
				default:
					previewCode = code as DwgPreview.PreviewType;
					startOfImage = this._reader.readRawLong();
					sizeImage = this._reader.readRawLong();
					break;
			}
		}

		let header: Uint8Array | null = null;
		header = this._reader.readBytes(headerDataSize!);

		let body: Uint8Array;
		if (sizeImage !== null) {
			body = this._reader.readBytes(sizeImage);
		} else {
			body = new Uint8Array(0);
		}

		const endSentinel: Uint8Array = this._reader.readSentinel();
		console.assert(DwgSectionIO.checkSentinel(endSentinel, this._endSentinel));

		return new DwgPreview(previewCode, header!, body);
	}
}
