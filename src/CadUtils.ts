import { ACadVersion } from './ACadVersion.js';
import { LineWeightType } from './Types/LineWeightType.js';

// TODO: CodePage enum needs to be defined or imported from a utility library
export enum CodePage {
	Unknown = 0,
	Usascii = 20127,
	Iso88591 = 28591,
	Iso88592 = 28592,
	Iso88593 = 28593,
	Iso88594 = 28594,
	Iso88595 = 28595,
	Iso88596 = 28596,
	Iso88597 = 28597,
	Iso88598 = 28598,
	Iso88599 = 28599,
	Iso885910 = 28600,
	Iso885913 = 28603,
	Iso885915 = 28605,
	Ibm437 = 437,
	Ibm737 = 737,
	Ibm775 = 775,
	Ibm850 = 850,
	Ibm852 = 852,
	Ibm855 = 855,
	Ibm857 = 857,
	Ibm860 = 860,
	Ibm861 = 861,
	Ibm863 = 863,
	Ibm864 = 864,
	Ibm865 = 865,
	Ibm869 = 869,
	Dos720 = 720,
	Cp866 = 866,
	Shift_jis = 932,
	Gb2312 = 936,
	Ksc5601 = 949,
	big5 = 950,
	Johab = 1361,
	Macintosh = 10000,
	Xmacromanian = 10010,
	Windows874 = 874,
	Windows1250 = 1250,
	Windows1251 = 1251,
	Windows1252 = 1252,
	Windows1253 = 1253,
	Windows1254 = 1254,
	Windows1255 = 1255,
	Windows1256 = 1256,
	Windows1257 = 1257,
	Windows1258 = 1258,
	Utf16 = 1200,
}

export class CadUtils {
	private static readonly _dxfEncodingMap: Map<string, CodePage> = new Map([
		["gb2312", CodePage.Gb2312],
		["kcs5601", CodePage.Ksc5601],
		["ascii", CodePage.Usascii],
		["big5", CodePage.big5],
		["johab", CodePage.Johab],
		["mac-roman", CodePage.Xmacromanian],
		["dos437", CodePage.Ibm437],
		["dos850", CodePage.Ibm850],
		["dos852", CodePage.Ibm852],
		["dos737", CodePage.Ibm737],
		["dos866", CodePage.Cp866],
		["dos855", CodePage.Ibm855],
		["dos857", CodePage.Ibm857],
		["dos860", CodePage.Ibm860],
		["dos861", CodePage.Ibm861],
		["dos863", CodePage.Ibm863],
		["dos864", CodePage.Ibm864],
		["dos865", CodePage.Ibm865],
		["dos869", CodePage.Ibm869],
		["dos720", CodePage.Dos720],
		["dos775", CodePage.Ibm775],
		["dos932", CodePage.Shift_jis],
		["dos950", CodePage.big5],
		["ansi_874", CodePage.Windows874],
		["ansi_932", CodePage.Shift_jis],
		["ansi_936", CodePage.Gb2312],
		["ansi_950", CodePage.big5],
		["ansi_1250", CodePage.Windows1250],
		["ansi1250", CodePage.Windows1250],
		["ansi_1251", CodePage.Windows1251],
		["ansi1251", CodePage.Windows1251],
		["ansi_1252", CodePage.Windows1252],
		["ansi1252", CodePage.Windows1252],
		["ansi_1253", CodePage.Windows1253],
		["ansi1253", CodePage.Windows1253],
		["ansi_1254", CodePage.Windows1254],
		["ansi1254", CodePage.Windows1254],
		["ansi_1255", CodePage.Windows1255],
		["ansi1255", CodePage.Windows1255],
		["ansi_1256", CodePage.Windows1256],
		["ansi1256", CodePage.Windows1256],
		["ansi_1257", CodePage.Windows1257],
		["ansi1257", CodePage.Windows1257],
		["iso8859-1", CodePage.Iso88591],
		["iso88591", CodePage.Iso88591],
		["iso8859-2", CodePage.Iso88592],
		["iso88592", CodePage.Iso88592],
		["iso8859-3", CodePage.Iso88593],
		["iso88593", CodePage.Iso88593],
		["iso8859-4", CodePage.Iso88594],
		["iso88594", CodePage.Iso88594],
		["iso8859-5", CodePage.Iso88595],
		["iso88595", CodePage.Iso88595],
		["iso8859-6", CodePage.Iso88596],
		["iso88596", CodePage.Iso88596],
		["iso8859-7", CodePage.Iso88597],
		["iso88597", CodePage.Iso88597],
		["iso8859-8", CodePage.Iso88598],
		["iso88598", CodePage.Iso88598],
		["iso8859-9", CodePage.Iso88599],
		["iso88599", CodePage.Iso88599],
		["iso8859-10", CodePage.Iso885910],
		["iso885910", CodePage.Iso885910],
		["iso8859-13", CodePage.Iso885913],
		["iso885913", CodePage.Iso885913],
		["iso885915", CodePage.Iso885915],
		["iso8859-15", CodePage.Iso885915],
	]);

	private static readonly _indexedValue: LineWeightType[] = [
		LineWeightType.W0, LineWeightType.W5, LineWeightType.W9, LineWeightType.W13,
		LineWeightType.W15, LineWeightType.W18, LineWeightType.W20, LineWeightType.W25,
		LineWeightType.W30, LineWeightType.W35, LineWeightType.W40, LineWeightType.W50,
		LineWeightType.W53, LineWeightType.W60, LineWeightType.W70, LineWeightType.W80,
		LineWeightType.W90, LineWeightType.W100, LineWeightType.W106, LineWeightType.W120,
		LineWeightType.W140, LineWeightType.W158, LineWeightType.W200, LineWeightType.W211,
	];

	private static readonly _pageCodes: CodePage[] = [
		CodePage.Unknown, CodePage.Usascii, CodePage.Iso88591, CodePage.Iso88592,
		CodePage.Iso88593, CodePage.Iso88594, CodePage.Iso88595, CodePage.Iso88596,
		CodePage.Iso88597, CodePage.Iso88598, CodePage.Iso88599, CodePage.Ibm437,
		CodePage.Ibm850, CodePage.Ibm852, CodePage.Ibm855, CodePage.Ibm857,
		CodePage.Ibm860, CodePage.Ibm861, CodePage.Ibm863, CodePage.Ibm864,
		CodePage.Ibm865, CodePage.Ibm869, CodePage.Shift_jis, CodePage.Macintosh,
		CodePage.big5, CodePage.Ksc5601, CodePage.Johab, CodePage.Cp866,
		CodePage.Windows1250, CodePage.Windows1251, CodePage.Windows1252, CodePage.Gb2312,
		CodePage.Windows1253, CodePage.Windows1254, CodePage.Windows1255, CodePage.Windows1256,
		CodePage.Windows1257, CodePage.Windows874, CodePage.Shift_jis, CodePage.Gb2312,
		CodePage.Ksc5601, CodePage.big5, CodePage.Johab, CodePage.Utf16,
		CodePage.Windows1258,
	];

	public static toValue(b: number): LineWeightType {
		switch (b) {
			case 28:
			case 29:
				return LineWeightType.ByLayer;
			case 30:
				return LineWeightType.ByBlock;
			case 31:
				return LineWeightType.Default;
			default:
				if (b < 0 || b >= CadUtils._indexedValue.length) {
					return LineWeightType.Default;
				}
				return CadUtils._indexedValue[b];
		}
	}

	public static toIndex(value: LineWeightType): number {
		let result = 0;
		switch (value) {
			case LineWeightType.Default:
				result = 31;
				break;
			case LineWeightType.ByBlock:
				result = 30;
				break;
			case LineWeightType.ByLayer:
				result = 29;
				break;
			default:
				result = CadUtils._indexedValue.indexOf(value);
				if (result < 0) result = 31;
				break;
		}
		return result;
	}

	public static getCodePage(value: string | number): CodePage {
		if (typeof value === 'string') {
			return CadUtils._dxfEncodingMap.get(value.toLowerCase()) ?? CodePage.Unknown;
		}
		return CadUtils._pageCodes[value] ?? CodePage.Unknown;
	}

	public static getCodePageName(value: CodePage): string | undefined {
		for (const [key, val] of CadUtils._dxfEncodingMap) {
			if (val === value) return key;
		}
		return undefined;
	}

	public static getCodeIndex(code: CodePage): number {
		return CadUtils._pageCodes.indexOf(code);
	}

	public static getVersionFromName(name: string): ACadVersion {
		const vname = name.replace(/\./g, '_').toUpperCase();
		const val = ACadVersion[vname as keyof typeof ACadVersion];
		return val !== undefined ? val : ACadVersion.Unknown;
	}

	public static getNameFromVersion(version: ACadVersion): string {
		return ACadVersion[version]?.replace(/_/g, '.') ?? 'Unknown';
	}

	public static toJulianCalendar(date: Date): number {
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		const day = date.getDate();
		const hour = date.getHours();
		const minute = date.getMinutes();
		const second = date.getSeconds();
		const millisecond = date.getMilliseconds();
		const fraction = day + hour / 24.0 + minute / 1440.0 + (second + millisecond / 1000) / 86400.0;

		if (month < 3) {
			year -= 1;
			month += 12;
		}

		const a = Math.floor(year / 100);
		const b = 2 - a + Math.floor(a / 4);
		let c: number;
		if (year < 0) {
			c = Math.floor(365.25 * year - 0.75);
		} else {
			c = Math.floor(365.25 * year);
		}

		const d = Math.floor(30.6001 * (month + 1));
		return b + c + d + 1720995 + fraction;
	}

	public static fromJulianCalendar(date: number): Date {
		if (date < 1721426 || date > 5373484) {
			throw new RangeError("The valid values range from 1721426 and 5373484.");
		}

		const julian = Math.floor(date);
		let fraction = date - julian;

		const temp = Math.floor((julian - 1867216.25) / 36524.25);
		const adjusted = julian + 1 + temp - Math.floor(temp / 4.0);

		const a = adjusted + 1524;
		const b = Math.floor((a - 122.1) / 365.25);
		const c = Math.floor(365.25 * b);
		const d = Math.floor((a - c) / 30.6001);

		const months = d < 14 ? d - 1 : d - 13;
		const years = months > 2 ? b - 4716 : b - 4715;
		const days = a - c - Math.floor(30.6001 * d);

		const hours = Math.floor(fraction * 24);
		fraction -= hours / 24.0;
		const minutes = Math.floor(fraction * 1440);
		fraction -= minutes / 1440.0;
		const decimalSeconds = fraction * 86400;
		const seconds = Math.floor(decimalSeconds);
		const milliseconds = Math.floor((decimalSeconds - seconds) * 1000);

		return new Date(years, months - 1, days, hours, minutes, seconds, milliseconds);
	}

	public static editingTime(elapsed: number): { days: number; hours: number; minutes: number; seconds: number; milliseconds: number } {
		const days = Math.floor(elapsed);
		let fraction = elapsed - days;
		const hours = Math.floor(fraction * 24);
		fraction -= hours / 24.0;
		const minutes = Math.floor(fraction * 1440);
		fraction -= minutes / 1440.0;
		const decimalSeconds = fraction * 86400;
		const seconds = Math.floor(decimalSeconds);
		const milliseconds = Math.floor((decimalSeconds - seconds) * 1000);
		return { days, hours, minutes, seconds, milliseconds };
	}

	public static dateToJulian(date: Date): { jdate: number; milliseconds: number } {
		const refDate = new Date(1, 0, 1, 12, 0, 0);
		if (date < refDate) {
			return { jdate: 0, milliseconds: 0 };
		}

		const adjusted = new Date(date.getTime() - 12 * 3600000);
		const month = adjusted.getMonth() + 1;
		const day = Math.floor((14.0 - month) / 12.0);
		const year = adjusted.getFullYear() + 4800 - day;
		const jdate = adjusted.getDate() +
			Math.floor((153.0 * (month + 12 * day - 3) + 2.0) / 5.0) +
			365 * year +
			Math.floor(year / 4.0) -
			Math.floor(year / 100.0) +
			Math.floor(year / 400.0) - 32045;
		const milliseconds = adjusted.getMilliseconds() +
			adjusted.getSeconds() * 1000 +
			adjusted.getMinutes() * 60000 +
			adjusted.getHours() * 3600000;
		return { jdate, milliseconds };
	}
}
