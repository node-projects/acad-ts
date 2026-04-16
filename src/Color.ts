export class Color {
	public static get black(): Color { return new Color(250); }
	public static get blue(): Color { return new Color(5); }
	public static get byBlock(): Color { return Color._fromIndex(0); }
	public static get byEntity(): Color { return Color._fromIndex(257); }
	public static get byLayer(): Color { return Color._fromIndex(256); }
	public static get cyan(): Color { return new Color(4); }
	public static get darkGray(): Color { return new Color(8); }
	public static get default(): Color { return new Color(7); }
	public static get green(): Color { return new Color(3); }
	public static get lightGray(): Color { return new Color(9); }
	public static get magenta(): Color { return new Color(6); }
	public static get red(): Color { return new Color(1); }
	public static get yellow(): Color { return new Color(2); }

	public get b(): number { return this.getRgb()[2]; }
	public get g(): number { return this.getRgb()[1]; }
	public get r(): number { return this.getRgb()[0]; }

	public get index(): number { return this.isTrueColor ? -1 : this._color; }

	public get isByBlock(): boolean { return this.index === 0; }
	public get isByLayer(): boolean { return this.index === 256; }
	public get isTrueColor(): boolean { return this._color > 257 || this._color < 0; }

	public get trueColor(): number { return this.isTrueColor ? (this._color ^ (1 << 30)) : -1; }

	private static readonly _maxTrueColor = 0b0001_0000_0000_0000_0000_0000_0000;
	private static readonly _trueColorFlag = 0b0100_0000_0000_0000_0000_0000_0000_0000;

	private static readonly _indexRgb: number[][] = [
		[0, 0, 0],
		[255, 0, 0], [255, 255, 0], [0, 255, 0], [0, 255, 255],
		[0, 0, 255], [255, 0, 255], [255, 255, 255], [128, 128, 128],
		[192, 192, 192], [255, 0, 0], [255, 127, 127], [165, 0, 0],
		[165, 82, 82], [127, 0, 0], [127, 63, 63], [76, 0, 0],
		[76, 38, 38], [38, 0, 0], [38, 19, 19], [255, 63, 0],
		[255, 159, 127], [165, 41, 0], [165, 103, 82], [127, 31, 0],
		[127, 79, 63], [76, 19, 0], [76, 47, 38], [38, 9, 0],
		[38, 28, 19], [255, 127, 0], [255, 191, 127], [165, 82, 0],
		[165, 124, 82], [127, 63, 0], [127, 95, 63], [76, 38, 0],
		[76, 57, 38], [38, 19, 0], [38, 28, 19], [255, 191, 0],
		[255, 223, 127], [165, 124, 0], [165, 145, 82], [127, 95, 0],
		[127, 111, 63], [76, 57, 0], [76, 66, 38], [38, 28, 0],
		[38, 33, 19], [255, 255, 0], [255, 255, 127], [165, 165, 0],
		[165, 165, 82], [127, 127, 0], [127, 127, 63], [76, 76, 0],
		[76, 76, 38], [38, 38, 0], [38, 38, 19], [191, 255, 0],
		[223, 255, 127], [124, 165, 0], [145, 165, 82], [95, 127, 0],
		[111, 127, 63], [57, 76, 0], [66, 76, 38], [28, 38, 0],
		[33, 38, 19], [127, 255, 0], [191, 255, 127], [82, 165, 0],
		[124, 165, 82], [63, 127, 0], [95, 127, 63], [38, 76, 0],
		[57, 76, 38], [19, 38, 0], [28, 38, 19], [63, 255, 0],
		[159, 255, 127], [41, 165, 0], [103, 165, 82], [31, 127, 0],
		[79, 127, 63], [19, 76, 0], [47, 76, 38], [9, 38, 0],
		[23, 38, 19], [0, 255, 0], [125, 255, 127], [0, 165, 0],
		[82, 165, 82], [0, 127, 0], [63, 127, 63], [0, 76, 0],
		[38, 76, 38], [0, 38, 0], [19, 38, 19], [0, 255, 63],
		[127, 255, 159], [0, 165, 41], [82, 165, 103], [0, 127, 31],
		[63, 127, 79], [0, 76, 19], [38, 76, 47], [0, 38, 9],
		[19, 88, 23], [0, 255, 127], [127, 255, 191], [0, 165, 82],
		[82, 165, 124], [0, 127, 63], [63, 127, 95], [0, 76, 38],
		[38, 76, 57], [0, 38, 19], [19, 88, 28], [0, 255, 191],
		[127, 255, 223], [0, 165, 124], [82, 165, 145], [0, 127, 95],
		[63, 127, 111], [0, 76, 57], [38, 76, 66], [0, 38, 28],
		[19, 88, 88], [0, 255, 255], [127, 255, 255], [0, 165, 165],
		[82, 165, 165], [0, 127, 127], [63, 127, 127], [0, 76, 76],
		[38, 76, 76], [0, 38, 38], [19, 88, 88], [0, 191, 255],
		[127, 223, 255], [0, 124, 165], [82, 145, 165], [0, 95, 127],
		[63, 111, 217], [0, 57, 76], [38, 66, 126], [0, 28, 38],
		[19, 88, 88], [0, 127, 255], [127, 191, 255], [0, 82, 165],
		[82, 124, 165], [0, 63, 127], [63, 95, 127], [0, 38, 76],
		[38, 57, 126], [0, 19, 38], [19, 28, 88], [0, 63, 255],
		[127, 159, 255], [0, 41, 165], [82, 103, 165], [0, 31, 127],
		[63, 79, 127], [0, 19, 76], [38, 47, 126], [0, 9, 38],
		[19, 23, 88], [0, 0, 255], [127, 127, 255], [0, 0, 165],
		[82, 82, 165], [0, 0, 127], [63, 63, 127], [0, 0, 76],
		[38, 38, 126], [0, 0, 38], [19, 19, 88], [63, 0, 255],
		[159, 127, 255], [41, 0, 165], [103, 82, 165], [31, 0, 127],
		[79, 63, 127], [19, 0, 76], [47, 38, 126], [9, 0, 38],
		[23, 19, 88], [127, 0, 255], [191, 127, 255], [165, 0, 82],
		[124, 82, 165], [63, 0, 127], [95, 63, 127], [38, 0, 76],
		[57, 38, 126], [19, 0, 38], [28, 19, 88], [191, 0, 255],
		[223, 127, 255], [124, 0, 165], [142, 82, 165], [95, 0, 127],
		[111, 63, 127], [57, 0, 76], [66, 38, 76], [28, 0, 38],
		[88, 19, 88], [255, 0, 255], [255, 127, 255], [165, 0, 165],
		[165, 82, 165], [127, 0, 127], [127, 63, 127], [76, 0, 76],
		[76, 38, 76], [38, 0, 38], [88, 19, 88], [255, 0, 191],
		[255, 127, 223], [165, 0, 124], [165, 82, 145], [127, 0, 95],
		[127, 63, 111], [76, 0, 57], [76, 38, 66], [38, 0, 28],
		[88, 19, 88], [255, 0, 127], [255, 127, 191], [165, 0, 82],
		[165, 82, 124], [127, 0, 63], [127, 63, 95], [76, 0, 38],
		[76, 38, 57], [38, 0, 19], [88, 19, 28], [255, 0, 63],
		[255, 127, 159], [165, 0, 41], [165, 82, 103], [127, 0, 31],
		[127, 63, 79], [76, 0, 19], [76, 38, 47], [38, 0, 9],
		[88, 19, 23], [0, 0, 0], [101, 101, 101], [102, 102, 102],
		[153, 153, 153], [204, 204, 204], [255, 255, 255],
	];

	private _color: number;

	constructor(index: number);
	constructor(r: number, g: number, b: number);
	constructor(indexOrR: number, g?: number, b?: number) {
		if (g !== undefined && b !== undefined) {
			// True color constructor from RGB
			const trueColor = Color._getInt24([indexOrR, g, b]);
			this._color = (trueColor | Color._trueColorFlag) >>> 0;
		} else {
			// Index color constructor - clamp to valid range for compatibility with DXF files
			const index = indexOrR;
			if (index < 0 || index > 257) {
				// Use ByLayer (256) as fallback for out-of-range values
				this._color = 256;
			} else {
				this._color = index;
			}
		}
	}

	private static _fromIndex(index: number): Color {
		const c = new Color(0);
		c._color = index;
		return c;
	}

	public static fromTrueColor(color: number): Color {
		const c = new Color(0);
		c._color = (color | Color._trueColorFlag) >>> 0;
		return c;
	}

	public static getIndexRGB(index: number): number[] {
		return Color._indexRgb[index];
	}

	public static approxIndex(r: number, g: number, b: number): number {
		let prevDist = -1;
		for (let i = 0; i < Color._indexRgb.length; i++) {
			const dist = (r - Color._indexRgb[i][0]) + (g - Color._indexRgb[i][1]) + (b - Color._indexRgb[i][2]);
			if (dist === 0) return i;
			if (dist < prevDist) {
				prevDist = dist;
				return i;
			}
		}
		return 0;
	}

	public equals(other: Color): boolean {
		return this._color === other._color;
	}

	public getApproxIndex(): number {
		if (this.isTrueColor) {
			return Color.approxIndex(this.r, this.g, this.b);
		} else {
			return this.index;
		}
	}

	public getRgb(): number[] {
		if (this.isTrueColor) {
			return this.getTrueColorRgb();
		} else {
			return Color.getIndexRGB(this._color);
		}
	}

	public getTrueColorRgb(): number[] {
		if (this.isTrueColor) {
			return Color._getRGBfromTrueColor(this._color);
		}
		return [0, 0, 0];
	}

	public toString(): string {
		if (this._color === 0) return "ByBlock";
		if (this._color === 256) return "ByLayer";
		if (this.isTrueColor) {
			const parts = this.getTrueColorRgb();
			return `True Color RGB:${parts[0]},${parts[1]},${parts[2]}`;
		}
		return `Indexed Color:${this.index}`;
	}

	private static _getInt24(array: number[]): number {
		return (array[0] | (array[1] << 8) | (array[2] << 16));
	}

	private static _getRGBfromTrueColor(color: number): number[] {
		return [color & 0xFF, (color >> 8) & 0xFF, (color >> 16) & 0xFF];
	}
}
