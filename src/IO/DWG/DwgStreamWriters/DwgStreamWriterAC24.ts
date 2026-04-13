import { DwgStreamWriterAC21 } from './DwgStreamWriterAC21.js';

export class DwgStreamWriterAC24 extends DwgStreamWriterAC21 {
	constructor(stream: Uint8Array, encoding: string) {
		super(stream, encoding);
	}

	override writeObjectType(value: number): void {
		//A bit pair, followed by either 1 or 2 bytes
		//Amount of bytes depends on the value
		if (value <= 255) {
			//Read the following byte
			this.write2Bits(0);
			this.writeByte(value & 0xFF);
		} else if (value >= 0x1F0 && value <= 0x2EF) {
			//Read following byte and add 0x1f0.
			this.write2Bits(1);
			this.writeByte((value - 0x1F0) & 0xFF);
		} else {
			//Read the following two bytes (raw short)
			this.write2Bits(2);
			const bytes = new Uint8Array(2);
			const view = new DataView(bytes.buffer);
			view.setInt16(0, value, true);
			this.writeBytes(bytes);
		}
	}
}
