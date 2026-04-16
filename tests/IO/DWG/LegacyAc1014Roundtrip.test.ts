import { describe, expect, it } from 'vitest';
import * as path from 'path';
import { TestVariables } from '../../TestVariables.js';
import { readFileAsArrayBuffer } from '../../testHelpers.js';
import { DwgReader } from '../../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../../src/IO/DWG/DwgWriter.js';

function collectEntityLinks(reader: DwgReader): Map<number, { owner: number | null; prev: number | null; next: number | null }> {
	const templates = ((reader as any)._builder?.templatesMap ?? new Map()) as Map<number, any>;
	const links = new Map<number, { owner: number | null; prev: number | null; next: number | null }>();

	for (const [handle, template] of templates.entries()) {
		if (!template || !(template.CadObject instanceof Object) || !('NextEntity' in template)) {
			continue;
		}

		links.set(handle, {
			owner: template.OwnerHandle ?? null,
			prev: template.PrevEntity ?? null,
			next: template.NextEntity ?? null,
		});
	}

	return links;
}

describe('LegacyAc1014Roundtrip', () => {
	it('preserves block chains and shape styles for sample_AC1014', () => {
		const samplePath = path.join(TestVariables.samplesFolder, 'sample_AC1014.dwg');
		const originalReader = new DwgReader(readFileAsArrayBuffer(samplePath));
		const original = originalReader.read();

		const buffer = new ArrayBuffer(32 * 1024 * 1024);
		const writer = new DwgWriter(buffer, original);
		writer.write();

		const roundtripBuffer = buffer.slice(0, writer.bytesWritten);
		const roundtripReader = new DwgReader(roundtripBuffer);
		const roundtrip = roundtripReader.read();

		expect([...roundtrip.entities].length).toBe([...original.entities].length);
		expect(roundtrip.blockRecords.get('MYBLOCK').entities.length).toBe(original.blockRecords.get('MYBLOCK').entities.length);
		expect(collectEntityLinks(roundtripReader)).toEqual(collectEntityLinks(originalReader));

		const originalShape = original.getCadObject(2185) as any;
		const roundtripShape = roundtrip.getCadObject(2185) as any;
		expect(roundtripShape?.constructor?.name).toBe('Shape');
		expect(roundtripShape?.shapeStyle?.name).toBe(originalShape?.shapeStyle?.name);

		const originalTableStyle = original.getCadObject(135) as any;
		const roundtripTableStyle = roundtrip.getCadObject(135) as any;
		expect(roundtripTableStyle?.constructor?.name).toBe('TableStyle');
		expect(roundtripTableStyle?.description).toBe(originalTableStyle?.description);
		expect(roundtripTableStyle?.dataCellStyle?.topBorder?.color?.index).toBe(originalTableStyle?.dataCellStyle?.topBorder?.color?.index);

		const originalRasterImage = [...original.entities].find((entity) => entity?.constructor?.name === 'RasterImage') as any;
		const roundtripRasterImage = [...roundtrip.entities].find((entity) => entity?.constructor?.name === 'RasterImage') as any;
		expect(roundtripRasterImage?.definitionReactor?.constructor?.name).toBe('ImageDefinitionReactor');
		expect(roundtripRasterImage?.definitionReactor?.handle).toBe(originalRasterImage?.definitionReactor?.handle);

		expect(roundtrip.vEntityControl?.constructor?.name).toBe('ViewportEntityControl');
		expect(roundtrip.vEntityControl?.handle).toBe(original.vEntityControl?.handle);
	});
});