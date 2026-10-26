import { describe, expect, it } from 'vitest';
import { MText } from '../src/Entities/MText.js';
import { TextProcessor } from '../src/Text/TextProcessor.js';

function plain(value: string): string {
	return TextProcessor.parse(value).result;
}

describe('TextProcessor', () => {
	it('StripsWidthFactorAfterOtherFormatCodes', () => {
		expect(plain('\\C18;\\c0;\\FTimes New Roman Bold|b1|i0|c1;\\H3.162892;\\W1.000000;CAR PARKING')).toBe('CAR PARKING');
	});

	it('StripsWidthFactorInsideGroup', () => {
		expect(plain('{\\W0.8;narrow} text')).toBe('narrow text');
	});

	it('StripsTrackingAndObliquing', () => {
		expect(plain('\\T1.1;track\\Q15;oblique')).toBe('trackoblique');
	});

	it('RendersStackedFractions', () => {
		expect(plain('1\\S2^3;')).toBe('12/3');
		expect(plain('\\S1/2;')).toBe('1/2');
		expect(plain('\\S1#2; in')).toBe('1/2 in');
		expect(plain('\\S\\^1^2;')).toBe('^1/2');
		expect(plain('\\S12;')).toBe('12');
	});

	it('StripsToggleCodes', () => {
		expect(plain('\\Lunder\\l \\Oover\\o \\Kstrike\\k')).toBe('under over strike');
	});

	it('HandlesSpecialCharactersAndEscapes', () => {
		expect(plain('a\\~b')).toBe('a b');
		expect(plain('col1\\Ncol2')).toBe('col1\ncol2');
		expect(plain('\\\\ \\{x\\}')).toBe('\\ {x}');
	});

	it('KeepsExistingBehaviour', () => {
		expect(plain('\\A1;\\H2.5x;\\pxqc;Top\\PBottom')).toBe('Top\nBottom');
	});

	it('StopsAtEndWhenTerminatorIsMissing', () => {
		expect(plain('text\\W0.8')).toBe('text');
	});

	it('MTextPlainTextUsesProcessor', () => {
		const text = new MText();
		text.value = '{\\W0.8;\\T1.1;narrow} \\S1^2;';
		expect(text.plainText).toBe('narrow 1/2');
	});
});
