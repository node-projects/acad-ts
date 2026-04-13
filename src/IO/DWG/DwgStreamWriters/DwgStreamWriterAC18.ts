import { Color } from '../../../Color.js';
import { Transparency } from '../../../Transparency.js';
import { DwgStreamWriterAC15 } from './DwgStreamWriterAC15.js';

export class DwgStreamWriterAC18 extends DwgStreamWriterAC15 {
	constructor(stream: Uint8Array, encoding: string) {
		super(stream, encoding);
	}

	override writeCmColor(value: Color): void {
		//CMC:
		//BS: color index(always 0)
		this.writeBitShort(0);

		const arr = new Uint8Array(4);

		if (value.isTrueColor) {
			arr[2] = value.r;
			arr[1] = value.g;
			arr[0] = value.b;
			arr[3] = 0b11000010;
		} else if (value.isByLayer) {
			arr[3] = 0b11000000;
		} else {
			arr[3] = 0b11000011;
			arr[0] = value.index & 0xFF;
		}

		//BL: RGB value
		const view = new DataView(arr.buffer);
		this.writeBitLong(view.getInt32(0, true));

		//RC: Color Byte
		this.writeByte(0);

		//(&1 => color name follows(TV),
		//&2 => book name follows(TV))
	}

	override writeEnColor(color: Color, transparency: Transparency): void {
		//BS : color number: flags + color index
		let size = 0;

		if (color.isByBlock && transparency.isByLayer) {
			super.writeBitShort(0);
			return;
		}

		//0x2000: color is followed by a transparency BL
		if (!transparency.isByLayer) {
			size = size | 0b10000000000000;
		}

		//0x8000: complex color (rgb).
		if (color.isTrueColor) {
			size = size | 0x8000;
		} else {
			//Color index: if no flags were set, the color is looked up by the color number (ACI color).
			size = size | (color.index & 0xFFFF);
		}

		super.writeBitShort(size & 0xFFFF);

		if (color.isTrueColor) {
			const arr = new Uint8Array([color.b, color.g, color.r, 0b11000010]);
			const view = new DataView(arr.buffer);
			const rgb = view.getUint32(0, true);
			super.writeBitLong(rgb | 0);
		}

		if (!transparency.isByLayer) {
			//The first byte represents the transparency type:
			//0 = BYLAYER,
			//1 = BYBLOCK,
			//3 = the transparency value in the last byte.
			super.writeBitLong(Transparency.toAlphaValue(transparency));
		}
	}

	override writeEnColorBook(color: Color, transparency: Transparency, isBookColor: boolean): void {
		//BS : color number: flags + color index
		let size = 0;

		if (color.isByBlock && transparency.isByLayer && !isBookColor) {
			super.writeBitShort(0);
			return;
		}

		//0x2000: color is followed by a transparency BL
		if (!transparency.isByLayer) {
			size = size | 0b10000000000000;
		}

		//0x4000: has AcDbColor reference (0x8000 is also set in this case).
		if (isBookColor) {
			size = size | 0x4000;
			size = size | 0x8000;
		}
		//0x8000: complex color (rgb).
		else if (color.isTrueColor) {
			size = size | 0x8000;
		} else {
			//Color index: if no flags were set, the color is looked up by the color number (ACI color).
			size = size | (color.index & 0xFFFF);
		}

		super.writeBitShort(size & 0xFFFF);

		if (color.isTrueColor) {
			const arr = new Uint8Array([color.b, color.g, color.r, 0b11000010]);
			const view = new DataView(arr.buffer);
			const rgb = view.getUint32(0, true);
			super.writeBitLong(rgb | 0);
		}

		if (!transparency.isByLayer) {
			//The first byte represents the transparency type:
			//0 = BYLAYER,
			//1 = BYBLOCK,
			//3 = the transparency value in the last byte.
			super.writeBitLong(Transparency.toAlphaValue(transparency));
		}
	}
}
