import { CadHeader } from '../../../Header/CadHeader.js';
import { DwgSectionIO } from '../DwgSectionIO.js';
import { DwgSectionDefinition } from '../FileHeaders/DwgSectionDefinition.js';
import { DwgStreamWriterBase } from './DwgStreamWriterBase.js';
import { IDwgStreamWriter } from './IDwgStreamWriter.js';

export class DwgAuxHeaderWriter extends DwgSectionIO {
	override get SectionName(): string { return DwgSectionDefinition.AuxHeader; }

	get bytesWritten(): number { return Math.ceil(this._writer.positionInBits / 8); }
	get writerStream(): ArrayBuffer { return this._writer.main.stream; }

	private _stream: Uint8Array;
	private _encoding: string;
	private _header: CadHeader;
	private _writer: IDwgStreamWriter;

	constructor(stream: Uint8Array, encoding: string, header: CadHeader) {
		super(header.version);

		this._stream = stream;
		this._encoding = encoding;
		this._header = header;

		this._writer = DwgStreamWriterBase.getStreamWriter(this._version, this._stream, encoding);
	}

	write(): void {
		//RC: 0xff 0x77 0x01
		this._writer.writeByte(0xFF);
		this._writer.writeByte(0x77);
		this._writer.writeByte(0x01);

		//RS: DWG version
		this._writer.writeRawShort(this._version as number);

		//RS: Maintenance version
		this._writer.writeRawShort(this._header.maintenanceVersion);

		//RL: Number of saves (starts at 1)
		this._writer.writeRawLong(1);
		//RL: -1
		this._writer.writeRawLong(-1);

		//RS: Number of saves part 1
		this._writer.writeRawShort(1);
		//RS: Number of saves part 2
		this._writer.writeRawShort(0);

		//RL: 0
		this._writer.writeRawLong(0);
		//RS: DWG version string
		this._writer.writeRawShort(this._version as number);
		//RS : Maintenance version
		this._writer.writeRawShort(this._header.maintenanceVersion);
		//RS: DWG version string
		this._writer.writeRawShort(this._version as number);
		//RS : Maintenance version
		this._writer.writeRawShort(this._header.maintenanceVersion);

		//RS: 0x0005
		this._writer.writeRawShort(0x5);
		//RS: 0x0893
		this._writer.writeRawShort(2195);
		//RS: 0x0005
		this._writer.writeRawShort(5);
		//RS: 0x0893
		this._writer.writeRawShort(2195);
		//RS: 0x0000
		this._writer.writeRawShort(0);
		//RS: 0x0001
		this._writer.writeRawShort(1);
		//RL: 0x0000
		this._writer.writeRawLong(0);
		//RL: 0x0000
		this._writer.writeRawLong(0);
		//RL: 0x0000
		this._writer.writeRawLong(0);
		//RL: 0x0000
		this._writer.writeRawLong(0);
		//RL: 0x0000
		this._writer.writeRawLong(0);

		//TD: TDCREATE(creation datetime)
		this._writer.write8BitJulianDate(this._header.createDateTime);

		//TD: TDUPDATE(update datetime)
		this._writer.write8BitJulianDate(this._header.updateDateTime);

		let handseed = -1;
		if (this._header.handleSeed <= 0x7FFFFFFF) {
			handseed = this._header.handleSeed;
		}

		//RL: HANDSEED(Handle seed) if < 0x7fffffff, otherwise - 1.
		this._writer.writeRawLong(handseed);
		//RL : Educational plot stamp(default value is 0)
		this._writer.writeRawLong(0);
		//RS: 0
		this._writer.writeRawShort(0);
		//RS: Number of saves part 1 – number of saves part 2
		this._writer.writeRawShort(1);
		//RL: 0
		this._writer.writeRawLong(0);
		//RL: 0
		this._writer.writeRawLong(0);
		//RL: 0
		this._writer.writeRawLong(0);
		//RL: Number of saves
		this._writer.writeRawLong(1);
		//RL : 0
		this._writer.writeRawLong(0);
		//RL: 0
		this._writer.writeRawLong(0);
		//RL: 0
		this._writer.writeRawLong(0);
		//RL: 0
		this._writer.writeRawLong(0);

		//R2018 +
		if (this.R2018Plus) {
			//RS : 0
			this._writer.writeRawShort(0);
			//RS : 0
			this._writer.writeRawShort(0);
		}
	}
}
