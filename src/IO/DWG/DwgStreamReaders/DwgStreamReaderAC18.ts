import { Color } from '../../../Color.js';
import { Transparency } from '../../../Transparency.js';
import { DwgStreamReaderAC15 } from './DwgStreamReaderAC15.js';

export class DwgStreamReaderAC18 extends DwgStreamReaderAC15 {
	constructor(stream: Uint8Array, resetPosition: boolean) {
		super(stream, resetPosition);
	}

	public override readCmColor(useTextStream: boolean = false): Color {
		let color: Color = Color.byLayer;
		const colorIndex: number = this.readBitShort();
		const rgb: number = this.readBitLong() >>> 0;
		const arr = new Uint8Array(4);
		arr[0] = rgb & 0xFF;
		arr[1] = (rgb >>> 8) & 0xFF;
		arr[2] = (rgb >>> 16) & 0xFF;
		arr[3] = (rgb >>> 24) & 0xFF;

		if (rgb === 0xC0000000) {
			color = Color.byLayer;
		} else if ((rgb & 0b0000_0001_0000_0000_0000_0000_0000_0000) !== 0) {
			color = new Color(arr[0]);
		} else {
			color = Color.fromTrueColor((arr[2] << 16) | (arr[1] << 8) | arr[0]);
		}

		const id: number = this.readByte();

		let colorName: string = '';
		if ((id & 1) === 1) {
			colorName = this.readVariableText();
		}

		let bookName: string = '';
		if ((id & 2) === 2) {
			bookName = this.readVariableText();
		}

		return color;
	}

	public override readEnColor(): { color: Color; transparency: Transparency; flag: boolean } {
		let color: Color = new Color(0);
		let transparency: Transparency = Transparency.byLayer;
		let isBookColor: boolean = false;

		const size: number = this.readBitShort();

		if (size !== 0) {
			const flags: number = (size & 0b1111111100000000) & 0xFFFF;

			if ((flags & 0x4000) > 0) {
				color = Color.byBlock;
				isBookColor = true;
			} else if ((flags & 0x8000) > 0) {
				const rgb: number = this.readBitLong() >>> 0;
				const arr = new Uint8Array(4);
				arr[0] = rgb & 0xFF;
				arr[1] = (rgb >>> 8) & 0xFF;
				arr[2] = (rgb >>> 16) & 0xFF;
				arr[3] = (rgb >>> 24) & 0xFF;
				color = Color.fromTrueColor((arr[2] << 16) | (arr[1] << 8) | arr[0]);
			} else {
				color = new Color(size & 0b111111111111);
			}

			if ((flags & 0x2000) > 0) {
				const value: number = this.readBitLong();
				transparency = Transparency.fromAlphaValue(value);
			} else {
				transparency = Transparency.byLayer;
			}
		} else {
			color = Color.byBlock;
			transparency = Transparency.opaque;
		}

		return { color, transparency, flag: isBookColor };
	}
}
