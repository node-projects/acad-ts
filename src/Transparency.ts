export class Transparency {
	public static get ByLayer(): Transparency { return new Transparency(-1); }
	public static get ByBlock(): Transparency { return new Transparency(100); }
	public static get Opaque(): Transparency { return new Transparency(0); }

	public get isByLayer(): boolean { return this._value === -1; }
	public get isByBlock(): boolean { return this._value === 100; }

	public get value(): number { return this._value; }
	public set value(val: number) {
		if (val === -1) { this._value = val; return; }
		if (val === 100) { this._value = val; return; }
		if (val < 0 || val > 90) {
			throw new RangeError("Transparency must be in range from 0 to 90.");
		}
		this._value = val;
	}

	private _value: number;

	constructor(value: number) {
		this._value = -1;
		this.value = value;
	}

	public static toAlphaValue(transparency: Transparency): number {
		const alpha = Math.round(255 * (100 - transparency.value) / 100.0);
		if (transparency.isByBlock) {
			// bytes: [0, 0, 0, 1]
			return 0x01000000;
		}
		// bytes: [alpha, 0, 0, 2]
		return (2 << 24) | alpha;
	}

	public static fromAlphaValue(value: number): Transparency {
		const alpha = value & 0xFF;
		const t = Math.round(100 - (alpha / 255.0) * 100);

		if (t === -1) return Transparency.ByLayer;
		if (t === 100) return Transparency.ByBlock;
		if (t < 0) return new Transparency(0);
		if (t > 90) return new Transparency(90);
		return new Transparency(t);
	}
}
