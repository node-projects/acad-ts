import { IDwgStreamWriter } from './IDwgStreamWriter.js';
import { DwgMergedStreamWriter } from './DwgMergedStreamWriter.js';

export class DwgmMergedStreamWriterAC14 extends DwgMergedStreamWriter implements IDwgStreamWriter {
	constructor(stream: Uint8Array, main: IDwgStreamWriter, handle: IDwgStreamWriter) {
		super(stream, main, main, handle);
	}

	override writeSpearShift(): void {
		const pos = this.main.positionInBits;

		if (this._savedPosition) {
			this.main.writeSpearShift();
			this.main.setPositionInBits(this.positionInBits);
			this.main.writeRawLong(pos);
			this.main.writeShiftValue();
			this.main.setPositionInBits(pos);
		}

		this.handleWriter.writeSpearShift();
		const handleWrittenBytes = Math.ceil(this.handleWriter.positionInBits / 8);
		const handleBuffer = new Uint8Array(this.handleWriter.stream).slice(0, handleWrittenBytes);
		this.main.writeBytes(handleBuffer);
		this.main.writeSpearShift();
	}
}
