import { AngularZeroHandling, ZeroHandling } from '../../Tables/ZeroHandling.js';
import { FractionFormat } from '../../Tables/FractionFormat.js';

export class UnitStyleFormat {
	public get angularDecimalPlaces(): number {
		return this._angularDecimalPlaces;
	}
	public set angularDecimalPlaces(value: number) {
		if (value < 0) {
			throw new RangeError('The number of decimal places must be equals or greater than zero.');
		}
		this._angularDecimalPlaces = value;
	}

	public angularZeroHandling: AngularZeroHandling = AngularZeroHandling.DisplayAll;

	public decimalSeparator: string;

	public degreesSymbol: string;

	public feetInchesSeparator: string;

	public feetSymbol: string;

	public get fractionHeightScale(): number {
		return this._fractionHeightScale;
	}
	public set fractionHeightScale(value: number) {
		if (value <= 0) {
			throw new RangeError('The fraction height scale must be greater than zero.');
		}
		this._fractionHeightScale = value;
	}

	public fractionType: FractionFormat;

	public gradiansSymbol: string;

	public inchesSymbol: string;

	public get linearDecimalPlaces(): number {
		return this._linearDecimalPlaces;
	}
	public set linearDecimalPlaces(value: number) {
		if (value < 0) {
			throw new RangeError('The number of decimal places must be equals or greater than zero.');
		}
		this._linearDecimalPlaces = value;
	}

	public linearZeroHandling: ZeroHandling = ZeroHandling.SuppressDecimalTrailingZeroes;

	public minutesSymbol: string;

	public radiansSymbol: string;

	public secondsSymbol: string;

	public get suppressAngularLeadingZeros(): boolean {
		return this.linearZeroHandling === ZeroHandling.SuppressDecimalLeadingZeroes
			|| this.linearZeroHandling === ZeroHandling.SuppressDecimalLeadingAndTrailingZeroes;
	}

	public get suppressAngularTrailingZeros(): boolean {
		return this.linearZeroHandling === ZeroHandling.SuppressDecimalTrailingZeroes
			|| this.linearZeroHandling === ZeroHandling.SuppressDecimalLeadingAndTrailingZeroes;
	}

	public get suppressLinearLeadingZeros(): boolean {
		return this.linearZeroHandling === ZeroHandling.SuppressDecimalLeadingZeroes
			|| this.linearZeroHandling === ZeroHandling.SuppressDecimalLeadingAndTrailingZeroes;
	}

	public get suppressLinearTrailingZeros(): boolean {
		return this.linearZeroHandling === ZeroHandling.SuppressDecimalTrailingZeroes
			|| this.linearZeroHandling === ZeroHandling.SuppressDecimalLeadingAndTrailingZeroes;
	}

	public get suppressZeroFeet(): boolean {
		return this.linearZeroHandling === ZeroHandling.SuppressZeroFeetAndInches
			|| this.linearZeroHandling === ZeroHandling.SuppressZeroFeetShowZeroInches;
	}

	public get suppressZeroInches(): boolean {
		return this.linearZeroHandling === ZeroHandling.SuppressZeroFeetAndInches
			|| this.linearZeroHandling === ZeroHandling.ShowZeroFeetSuppressZeroInches;
	}

	private _angularDecimalPlaces: number;
	private _fractionHeightScale: number;
	private _linearDecimalPlaces: number;

	public constructor() {
		this._linearDecimalPlaces = 2;
		this._angularDecimalPlaces = 0;
		this.decimalSeparator = '.';
		this.feetInchesSeparator = '-';
		this.degreesSymbol = '°';
		this.minutesSymbol = "'";
		this.secondsSymbol = '"';
		this.radiansSymbol = 'r';
		this.gradiansSymbol = 'g';
		this.feetSymbol = "'";
		this.inchesSymbol = '"';
		this._fractionHeightScale = 1.0;
		this.fractionType = FractionFormat.Horizontal;
	}

	public getZeroHandlingFormat(isAngular: boolean = false): string {
		let decimalPlaces: number;
		let leading: string;
		let trailing: string;

		if (isAngular) {
			decimalPlaces = this.angularDecimalPlaces;
			leading = this.angularZeroHandling === AngularZeroHandling.SuppressLeadingZeroes
				|| this.angularZeroHandling === AngularZeroHandling.SupressAll ? '#' : '0';
			trailing = this.angularZeroHandling === AngularZeroHandling.SupressTrailingZeroes
				|| this.angularZeroHandling === AngularZeroHandling.SupressAll ? '#' : '0';
		} else {
			decimalPlaces = this.linearDecimalPlaces;
			leading = this.linearZeroHandling === ZeroHandling.SuppressDecimalLeadingZeroes
				|| this.linearZeroHandling === ZeroHandling.SuppressDecimalLeadingAndTrailingZeroes
				? '#' : '0';
			trailing = this.linearZeroHandling === ZeroHandling.SuppressDecimalTrailingZeroes
				|| this.linearZeroHandling === ZeroHandling.SuppressDecimalLeadingAndTrailingZeroes
				? '#' : '0';
		}

		let zeroes = leading + '.';
		for (let i = 0; i < decimalPlaces; i++) {
			zeroes += trailing;
		}
		return zeroes;
	}

	public toArchitectural(value: number): string {
		const feet = Math.trunc(value / 12);
		const inchesDec = value - 12 * feet;
		const inches = Math.trunc(inchesDec);

		if (Math.abs(inchesDec) < 1e-12) {
			if (feet === 0) {
				if (this.suppressZeroFeet) {
					return `0${this.inchesSymbol}`;
				}
				if (this.suppressZeroInches) {
					return `0${this.feetSymbol}`;
				}
				return `0${this.feetSymbol}${this.feetInchesSeparator}0${this.inchesSymbol}`;
			}
			if (this.suppressZeroInches) {
				return `${feet}${this.feetSymbol}`;
			}
			return `${feet}${this.feetSymbol}${this.feetInchesSeparator}0${this.inchesSymbol}`;
		}

		const { numerator, denominator } = UnitStyleFormat.getFraction(inchesDec, Math.pow(2, this.linearDecimalPlaces));

		if (numerator === 0) {
			if (inches === 0) {
				if (feet === 0) {
					if (this.suppressZeroFeet) {
						return `0${this.inchesSymbol}`;
					}
					if (this.suppressZeroInches) {
						return `0${this.feetSymbol}`;
					}
					return `0${this.feetSymbol}${this.feetInchesSeparator}0${this.inchesSymbol}`;
				}
				if (this.suppressZeroInches) {
					return `${feet}${this.feetSymbol}`;
				}
				return `${feet}${this.feetSymbol}${this.feetInchesSeparator}0${this.inchesSymbol}`;
			}
			if (feet === 0) {
				if (this.suppressZeroFeet) {
					return `${inches}${this.inchesSymbol}`;
				}
				return `0${this.feetSymbol}${this.feetInchesSeparator}${inches}${this.inchesSymbol}`;
			}
			return `${feet}${this.feetSymbol}${this.feetInchesSeparator}${inches}${this.inchesSymbol}`;
		}

		let feetStr: string;
		if (this.suppressZeroFeet && feet === 0) {
			feetStr = '';
		} else {
			feetStr = feet + this.feetSymbol + this.feetInchesSeparator;
		}

		let text = '';
		switch (this.fractionType) {
			case FractionFormat.Diagonal:
				text = `\\A1;${feetStr}${inches}{\\H${this.fractionHeightScale}x;\\S${numerator}#${denominator};}${this.inchesSymbol}`;
				break;
			case FractionFormat.Horizontal:
				text = `\\A1;${feetStr}${inches}{\\H${this.fractionHeightScale}x;\\S${numerator}/${denominator};}${this.inchesSymbol}`;
				break;
			case FractionFormat.None:
				text = `${feetStr}${inches} ${numerator}/${denominator}${this.inchesSymbol}`;
				break;
		}
		return text;
	}

	public toDecimal(value: number, isAngular: boolean = false): string {
		return UnitStyleFormat.formatNumber(value, this.getZeroHandlingFormat(isAngular), this.decimalSeparator);
	}

	public toDegrees(angle: number): string {
		const degrees = angle * (180.0 / Math.PI);
		return UnitStyleFormat.formatNumber(degrees, this.getZeroHandlingFormat(true), this.decimalSeparator) + this.degreesSymbol;
	}

	public toDegreesMinutesSeconds(angle: number): string {
		const degrees = angle * (180.0 / Math.PI);
		const minutes = (degrees - Math.trunc(degrees)) * 60;
		const seconds = (minutes - Math.trunc(minutes)) * 60;

		if (this.angularDecimalPlaces === 0) {
			return `${Math.round(degrees)}${this.degreesSymbol}`;
		}

		if (this.angularDecimalPlaces === 1 || this.angularDecimalPlaces === 2) {
			return `${Math.trunc(degrees)}${this.degreesSymbol}${Math.round(minutes)}${this.minutesSymbol}`;
		}

		if (this.angularDecimalPlaces === 3 || this.angularDecimalPlaces === 4) {
			return `${Math.trunc(degrees)}${this.degreesSymbol}${Math.trunc(minutes)}${this.minutesSymbol}${Math.round(seconds)}${this.secondsSymbol}`;
		}

		const f = '0.' + '0'.repeat(this.angularDecimalPlaces - 4);
		return `${Math.trunc(degrees)}${this.degreesSymbol}${Math.trunc(minutes)}${this.minutesSymbol}${UnitStyleFormat.formatNumber(seconds, f, this.decimalSeparator)}${this.secondsSymbol}`;
	}

	public toEngineering(value: number): string {
		const feet = Math.trunc(value / 12);
		const inches = value - 12 * feet;

		if (Math.abs(inches) < 1e-12) {
			if (feet === 0) {
				if (this.suppressZeroFeet) {
					return `0${this.inchesSymbol}`;
				}
				if (this.suppressZeroInches) {
					return `0${this.feetSymbol}`;
				}
				return `0${this.feetSymbol}${this.feetInchesSeparator}0${this.inchesSymbol}`;
			}
			if (this.suppressZeroInches) {
				return `${feet}${this.feetSymbol}`;
			}
			return `${feet}${this.feetSymbol}${this.feetInchesSeparator}0${this.inchesSymbol}`;
		}

		const inchesDec = UnitStyleFormat.formatNumber(inches, this.getZeroHandlingFormat(), this.decimalSeparator);
		if (feet === 0) {
			if (this.suppressZeroFeet) {
				return `${inches}${this.inchesSymbol}`;
			}
			return `0${this.feetSymbol}${this.feetInchesSeparator}${inchesDec}${this.inchesSymbol}`;
		}
		return `${feet}${this.feetSymbol}${this.feetInchesSeparator}${inchesDec}${this.inchesSymbol}`;
	}

	public toFractional(value: number): string {
		const num = Math.trunc(value);
		const { numerator, denominator } = UnitStyleFormat.getFraction(value, Math.pow(2, this.linearDecimalPlaces));
		if (numerator === 0) {
			return `${Math.trunc(value)}`;
		}

		let text = '';
		switch (this.fractionType) {
			case FractionFormat.Diagonal:
				text = `\\A1;${num}{\\H${this.fractionHeightScale}x;\\S${numerator}#${denominator};}`;
				break;
			case FractionFormat.Horizontal:
				text = `\\A1;${num}{\\H${this.fractionHeightScale}x;\\S${numerator}/${denominator};}`;
				break;
			case FractionFormat.None: {
				const prefix = num === 0 ? '' : `${num} `;
				text = `${prefix}${numerator}/${denominator}`;
				break;
			}
		}
		return text;
	}

	public toGradians(angle: number): string {
		const gradians = angle * (200.0 / Math.PI);
		return UnitStyleFormat.formatNumber(gradians, this.getZeroHandlingFormat(true), this.decimalSeparator) + this.gradiansSymbol;
	}

	public toRadians(angle: number): string {
		return UnitStyleFormat.formatNumber(angle, this.getZeroHandlingFormat(true), this.decimalSeparator) + this.radiansSymbol;
	}

	public toScientific(value: number): string {
		return value.toExponential(this.linearDecimalPlaces).toUpperCase();
	}

	private static getFraction(number: number, precision: number): { numerator: number; denominator: number } {
		let numerator = Math.round((number - Math.trunc(number)) * precision);
		let commonFactor = UnitStyleFormat.getGCD(numerator, precision);
		if (commonFactor <= 0) {
			commonFactor = 1;
		}
		numerator = Math.trunc(numerator / commonFactor);
		const denominator = Math.trunc(precision / commonFactor);
		return { numerator, denominator };
	}

	private static getGCD(number1: number, number2: number): number {
		let a = number1;
		let b = number2;
		while (b !== 0) {
			const count = a % b;
			a = b;
			b = count;
		}
		return a;
	}

	private static formatNumber(value: number, format: string, decimalSeparator: string): string {
		// Parse format string like "0.00", "#.##", "0.##" etc.
		const parts = format.split('.');
		const intPart = parts[0] || '0';
		const decPart = parts[1] || '';

		const decimalPlaces = decPart.length;
		const suppressLeading = intPart === '#';
		const suppressTrailing = decPart.length > 0 && decPart[0] === '#';

		let result = value.toFixed(decimalPlaces);

		if (decimalSeparator !== '.') {
			result = result.replace('.', decimalSeparator);
		}

		if (suppressTrailing && result.includes(decimalSeparator)) {
			while (result.endsWith('0')) {
				result = result.slice(0, -1);
			}
			if (result.endsWith(decimalSeparator)) {
				result = result.slice(0, -1);
			}
		}

		if (suppressLeading) {
			if (result.startsWith('0' + decimalSeparator)) {
				result = result.slice(1);
			} else if (result.startsWith('-0' + decimalSeparator)) {
				result = '-' + result.slice(2);
			}
		}

		return result;
	}
}
