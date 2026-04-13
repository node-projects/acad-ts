import { DwgStreamReaderAC18 } from './DwgStreamReaderAC18.js';

export class DwgStreamReaderAC21 extends DwgStreamReaderAC18 {
	constructor(stream: Uint8Array, resetPosition: boolean) {
		super(stream, resetPosition);
	}

	public override readTextUnicode(): string {
		const textLength: number = this.readShortLittleEndian();
		let value: string;
		if (textLength === 0) {
			value = '';
		} else {
			const length: number = (textLength << 1) & 0xFFFF;
			value = this.readStringEncoded(length, 'utf-16le').replace(/\0/g, '');
		}
		return value;
	}

	public override readVariableText(): string {
		const textLength: number = this.readBitShort();
		let value: string;
		if (textLength === 0) {
			value = '';
		} else {
			const length: number = (textLength << 1) & 0xFFFF;
			value = this.readStringEncoded(length, 'utf-16le').replace(/\0/g, '');
		}
		return value;
	}
}
