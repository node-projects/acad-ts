import { DwgStreamWriterAC18 } from './DwgStreamWriterAC18.js';

export class DwgStreamWriterAC21 extends DwgStreamWriterAC18 {
	constructor(stream: Uint8Array, encoding: string) {
		super(stream, encoding);
	}

	override writeVariableText(value: string): void {
		if (!value || value.length === 0) {
			super.writeBitShort(0);
			return;
		}
		super.writeBitShort(value.length);
		const encoder = new TextEncoder();
		// UTF-16LE encoding for AC21+
		const bytes = new Uint8Array(value.length * 2);
		for (let i = 0; i < value.length; i++) {
			const code = value.charCodeAt(i);
			bytes[i * 2] = code & 0xFF;
			bytes[i * 2 + 1] = (code >>> 8) & 0xFF;
		}
		super.writeBytes(bytes);
	}

	override writeTextUnicode(value: string): void {
		this.writeRawShort(value.length + 1);
		const bytes = new Uint8Array(value.length * 2);
		for (let i = 0; i < value.length; i++) {
			const code = value.charCodeAt(i);
			bytes[i * 2] = code & 0xFF;
			bytes[i * 2 + 1] = (code >>> 8) & 0xFF;
		}
		this.writeBytes(bytes);
		// Two null bytes for Unicode terminator
		this.writeByte(0);
		this.writeByte(0);
	}
}
