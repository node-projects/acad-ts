import { AppId } from '../Tables/AppId.js';
import { FontFlags } from '../Tables/FontFlags.js';
import { TextStyle } from '../Tables/TextStyle.js';
import { ExtendedData } from '../XData/ExtendedData.js';
import { ExtendedDataDictionary } from '../XData/ExtendedDataDictionary.js';
import { ExtendedDataInteger32 } from '../XData/ExtendedDataInteger32.js';
import { ExtendedDataString } from '../XData/ExtendedDataString.js';

const italicExtendedFontFlag = 0x01000000;
const boldExtendedFontFlag = 0x02000000;

export function getTextStyleExtendedDataForWrite(style: TextStyle): ExtendedDataDictionary {
	const extendedFontFlags = toExtendedFontFlags(style.trueType);
	if (extendedFontFlags === 0 || style.isShapeFile || isShxFont(style.filename)) {
		return style.extendedData;
	}

	const fontFamily = getFontFamily(style.filename);
	if (!fontFamily) {
		return style.extendedData;
	}

	let existingAcadEntry: [AppId, ExtendedData] | null = null;
	for (const entry of style.extendedData) {
		if (entry[0].name.toUpperCase() === AppId.defaultName) {
			existingAcadEntry = entry;
			break;
		}
	}

	const acadAppId = style.document?.appIds?.tryGetValue(AppId.defaultName) ?? existingAcadEntry?.[0] ?? null;
	if (acadAppId === null) {
		return style.extendedData;
	}

	const result = new ExtendedDataDictionary(style);
	for (const [appId, data] of style.extendedData) {
		if (appId.name.toUpperCase() !== AppId.defaultName) {
			result.set(appId, data);
		}
	}

	const records = existingAcadEntry ? [...existingAcadEntry[1].records] : [];
	const fontNameRecord = new ExtendedDataString(fontFamily);
	const fontFlagsRecord = new ExtendedDataInteger32(extendedFontFlags);
	if (records[0] instanceof ExtendedDataString && records[1] instanceof ExtendedDataInteger32) {
		records.splice(0, 2, fontNameRecord, fontFlagsRecord);
	} else {
		records.unshift(fontNameRecord, fontFlagsRecord);
	}

	result.set(acadAppId, new ExtendedData(records));
	return result;
}

export function applyTextStyleTrueTypeFromExtendedData(style: TextStyle): void {
	const acadData = style.extendedData.tryGetByName(AppId.defaultName);
	if (!acadData.found) {
		return;
	}

	const records = acadData.value!.records;
	for (let i = 0; i < records.length - 1; i++) {
		const fontNameRecord = records[i];
		const fontFlagsRecord = records[i + 1];
		if (fontNameRecord instanceof ExtendedDataString && fontFlagsRecord instanceof ExtendedDataInteger32) {
			style.trueType = fromExtendedFontFlags(fontFlagsRecord.value);
			return;
		}
	}
}

function toExtendedFontFlags(flags: FontFlags): number {
	let result = 0;
	if ((flags & FontFlags.Italic) !== 0) {
		result |= italicExtendedFontFlag;
	}
	if ((flags & FontFlags.Bold) !== 0) {
		result |= boldExtendedFontFlag;
	}
	return result;
}

function fromExtendedFontFlags(flags: number): FontFlags {
	let result = FontFlags.Regular;
	if ((flags & italicExtendedFontFlag) !== 0) {
		result |= FontFlags.Italic;
	}
	if ((flags & boldExtendedFontFlag) !== 0) {
		result |= FontFlags.Bold;
	}
	return result;
}

function isShxFont(filename: string): boolean {
	return filename.trim().toLowerCase().endsWith('.shx');
}

function getFontFamily(filename: string): string {
	const basename = filename.trim().replace(/\\/g, '/').split('/').pop() ?? '';
	const extensionIndex = basename.lastIndexOf('.');
	return extensionIndex > 0 ? basename.slice(0, extensionIndex) : basename;
}
