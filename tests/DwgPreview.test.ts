import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { DwgPreview } from '../src/DwgPreview.js';
import { TestVariables } from './TestVariables.js';

describe('DwgPreviewTests', () => {
	it('SaveWritesSupportedPreviewBytes', () => {
		const rawHeader = new Uint8Array([1, 2, 3]);
		const rawImage = new Uint8Array([4, 5, 6, 7]);

		for (const previewType of [DwgPreview.PreviewType.Bmp, DwgPreview.PreviewType.Wmf, DwgPreview.PreviewType.Png]) {
			const preview = new DwgPreview(previewType, rawHeader, rawImage);
			const outPath = path.join(TestVariables.outputSamplesFolder, `preview_${previewType}.bin`);

			preview.save(outPath);

			const written = fs.readFileSync(outPath);
			expect(Array.from(written)).toEqual(Array.from(rawImage));
		}
	});

	it('SaveRejectsUnknownPreviewType', () => {
		const preview = new DwgPreview();
		const outPath = path.join(TestVariables.outputSamplesFolder, 'preview_unknown.bin');

		expect(() => preview.save(outPath)).toThrow('not supported');
	});
});