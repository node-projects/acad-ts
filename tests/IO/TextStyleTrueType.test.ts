import { describe, expect, it } from 'vitest';
import { CadDocument } from '../../src/CadDocument.js';
import { DwgReader } from '../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../src/IO/DWG/DwgWriter.js';
import { DxfReader } from '../../src/IO/DXF/DxfReader.js';
import { DxfWriter } from '../../src/IO/DXF/DxfWriter.js';
import { FontFlags } from '../../src/Tables/FontFlags.js';
import { TextStyle } from '../../src/Tables/TextStyle.js';
import { ExtendedDataInteger16 } from '../../src/XData/ExtendedDataInteger16.js';
import { ExtendedDataInteger32 } from '../../src/XData/ExtendedDataInteger32.js';
import { ExtendedDataString } from '../../src/XData/ExtendedDataString.js';

class InMemoryAsciiStream {
	private readonly chunks: string[] = [];

	public write(value: string): void {
		this.chunks.push(value);
	}

	public flush(): void {}

	public close(): void {}

	public toUint8Array(): Uint8Array {
		return new TextEncoder().encode(this.chunks.join(''));
	}
}

function createDocumentWithBoldItalicStyle(): { document: CadDocument; style: TextStyle } {
	const document = new CadDocument();
	const style = new TextStyle('ArialBoldItalic');
	style.filename = 'fonts/Arial.ttf';
	style.trueType = FontFlags.Bold | FontFlags.Italic;
	document.textStyles.add(style);
	return { document, style };
}

function expectExtendedFontData(style: TextStyle): void {
	const records = style.extendedData.getByName('ACAD').records;
	expect(records[0]).toBeInstanceOf(ExtendedDataString);
	expect(records[0].value).toBe('Arial');
	expect(records[1]).toBeInstanceOf(ExtendedDataInteger32);
	expect(records[1].value).toBe(0x03000000);
	expect(style.trueType).toBe(FontFlags.Bold | FontFlags.Italic);
}

describe('TextStyle TrueType serialization', () => {
	it('writes and reads bold/italic extended font data in DXF', () => {
		const { document, style } = createDocumentWithBoldItalicStyle();
		const stream = new InMemoryAsciiStream();

		new DxfWriter(stream as any, document).write();

		expect(style.extendedData.size).toBe(0);
		const reread = new DxfReader(stream.toUint8Array()).read();
		expectExtendedFontData(reread.textStyles.get(style.name));
	});

	it('writes and reads bold/italic extended font data in DWG', () => {
		const { document, style } = createDocumentWithBoldItalicStyle();
		const output = DwgWriter.writeToBuffer(document);
		const input = output.buffer.slice(output.byteOffset, output.byteOffset + output.byteLength);

		expect(style.extendedData.size).toBe(0);
		const reread = new DwgReader(input).read();
		expectExtendedFontData(reread.textStyles.get(style.name));
	});

	it('preserves other ACAD records while adding extended font data', () => {
		const { document, style } = createDocumentWithBoldItalicStyle();
		style.extendedData.addWithRecords(document.appIds.get('ACAD'), [
			new ExtendedDataString('custom-data'),
			new ExtendedDataInteger16(7),
		]);
		const stream = new InMemoryAsciiStream();

		new DxfWriter(stream as any, document).write();

		const originalRecords = style.extendedData.getByName('ACAD').records;
		expect(originalRecords).toHaveLength(2);
		expect((originalRecords[0] as ExtendedDataString).value).toBe('custom-data');
		const reread = new DxfReader(stream.toUint8Array()).read();
		const rereadRecords = reread.textStyles.get(style.name).extendedData.getByName('ACAD').records;
		expect(rereadRecords).toHaveLength(4);
		expect((rereadRecords[2] as ExtendedDataString).value).toBe('custom-data');
		expect((rereadRecords[3] as ExtendedDataInteger16).value).toBe(7);
	});

	it('does not add TrueType font data to SHX styles', () => {
		const document = new CadDocument();
		const style = new TextStyle('Simplex');
		style.filename = 'simplex.shx';
		style.trueType = FontFlags.Bold;
		document.textStyles.add(style);
		const stream = new InMemoryAsciiStream();

		new DxfWriter(stream as any, document).write();

		const reread = new DxfReader(stream.toUint8Array()).read();
		expect(reread.textStyles.get(style.name).extendedData.containsKeyName('ACAD')).toBe(false);
	});
});
