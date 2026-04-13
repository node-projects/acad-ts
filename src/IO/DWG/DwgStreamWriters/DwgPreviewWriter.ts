import { ACadVersion } from '../../../ACadVersion.js';
import { DwgPreview } from '../../../DwgPreview.js';
import { DwgSectionIO } from '../DwgSectionIO.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { DwgStreamWriterBase } from './DwgStreamWriterBase.js';
import { IDwgStreamWriter } from './IDwgStreamWriter.js';

export class DwgPreviewWriter extends DwgSectionIO {
	override get SectionName(): string { return DwgSectionDefinition.Preview; }

	get bytesWritten(): number { return Math.ceil(this._swriter.positionInBits / 8); }
	get writerStream(): ArrayBuffer { return this._swriter.main.stream; }

	private _swriter: IDwgStreamWriter;

	private readonly _startSentinel: Uint8Array = DwgSectionDefinition.StartSentinels.get(DwgSectionDefinition.Preview)!;

	private readonly _endSentinel: Uint8Array = DwgSectionDefinition.EndSentinels.get(DwgSectionDefinition.Preview)!;

	constructor(version: ACadVersion, stream: Uint8Array) {
		super(version);
		this._swriter = DwgStreamWriterBase.getStreamWriter(version, stream, 'windows-1252');
	}

	write(): void {
		this._swriter.writeBytes(this._startSentinel);
		//overall size	RL	overall size of image area
		this._swriter.writeRawLong(1);
		//images present RC counter indicating what is present here
		this._swriter.writeByte(0);
		this._swriter.writeBytes(this._endSentinel);
	}

	writePreview(preview: DwgPreview, startPos: number): void {
		const size = preview.rawHeader.length + preview.rawImage.length + 19;

		this._swriter.writeBytes(this._startSentinel);

		//overall size	RL	overall size of image area
		this._swriter.writeRawLong(size);

		//images present RC counter indicating what is present here
		this._swriter.writeByte(2);

		//Code RC code indicating what follows
		this._swriter.writeByte(1);

		const headerOffset = startPos + 12 + 5 + 32; // approximate stream position + offsets
		//header data start RL start of header data
		this._swriter.writeRawLong(headerOffset);

		//header data size RL size of header data
		this._swriter.writeRawLong(preview.rawHeader.length);

		//Code RC code indicating what follows
		this._swriter.writeByte(preview.code);

		const imageOffset = headerOffset + preview.rawHeader.length;
		//image data start RL start of image data
		this._swriter.writeRawLong(imageOffset);

		//image data size RL size of image data
		this._swriter.writeRawLong(preview.rawImage.length);

		this._swriter.writeBytes(preview.rawHeader);

		this._swriter.writeBytes(preview.rawImage);

		this._swriter.writeBytes(this._endSentinel);
	}
}
