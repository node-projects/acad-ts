import { CadDocument } from '../../../CadDocument.js';
import { DwgFileHeaderAC21 } from '../FileHeaders/DwgFileHeaderAC21.js';
import { DwgFileHeaderWriterBase } from './DwgFileHeaderWriterBase.js';
import { DwgLZ77AC21Compressor } from './DwgLZ77AC21Compressor.js';
import { R2007Random, r2007Checksum, r2007Crc, r2007ReedSolomon, r2007Rotate, r2007Seed, r2007Words } from '../DwgR2007Encoding.js';

const align = (n: number, boundary: number) => Math.ceil(n / boundary) * boundary;
interface Page { id: number; bytes: Uint8Array; }
interface Section { name: string; data: Uint8Array; compressed: boolean; pages: { page: Page; offset: number; data: Uint8Array; stored: Uint8Array }[]; }

/** R2007 uses its own RS-protected container, unlike R2004 and R2010. */
export class DwgFileHeaderWriterAC21 extends DwgFileHeaderWriterBase<DwgFileHeaderAC21> {
	override get fileHeaderSize(): number { return 0x480; }
	override get handleSectionOffset(): number { return 0; }
	private sections: Section[] = [];
	constructor(stream: Uint8Array, encoding: string, document: CadDocument) {
		super(stream, encoding, document, new DwgFileHeaderAC21(document.header.version));
	}
	override addSection(name: string, data: Uint8Array, compressed: boolean): void {
		this.sections.push({ name, data, compressed, pages: [] });
	}
	override writeFile(): void {
		const pages: Page[] = [];
		const add = (bytes: Uint8Array): Page => {
			const page = { id: pages.length + 1, bytes }; pages.push(page); return page;
		};
		const system = (data: Uint8Array): { bytes: Uint8Array; factor: number } => {
			const padded = new Uint8Array(align(data.length, 8)); padded.set(data);
			const size = Math.max(0x400, align(Math.ceil(padded.length * 2 / 239) * 255, 32));
			const factor = Math.floor(Math.floor(size / 255) * 239 / padded.length);
			const repeated = new Uint8Array(padded.length * factor);
			for (let i = 0; i < factor; i++) repeated.set(padded, i * padded.length);
			const bytes = new Uint8Array(size); bytes.set(r2007ReedSolomon(repeated, 239));
			return { bytes, factor };
		};
		const count = this.sections.reduce((n, s) => n + Math.ceil(s.data.length / 0xf800), 0) + 4;
		const placeholder = system(new Uint8Array(count * 16));
		const map1 = add(placeholder.bytes), map2 = add(placeholder.bytes);
		const compressor = new DwgLZ77AC21Compressor();
		for (const section of this.sections) {
			for (let offset = 0; offset < section.data.length; offset += 0xf800) {
				const data = section.data.slice(offset, offset + 0xf800);
				let stored = data;
				if (section.compressed) {
					const compressed: number[] = [];
					compressor.compress(data, 0, data.length, compressed);
					if (compressed.length < data.length) stored = Uint8Array.from(compressed);
				}
				const padded = new Uint8Array(align(stored.length, 8)); padded.set(stored);
				const encoded = r2007ReedSolomon(padded, 251);
				const bytes = new Uint8Array(align(encoded.length, 32)); bytes.set(encoded);
				section.pages.push({ page: add(bytes), offset, data, stored });
			}
		}
		const hashes: Record<string, number> = {
			'AcDb:Header': 0x32b803d9, 'AcDb:Classes': 0x3f54045f, 'AcDb:SummaryInfo': 0x717a060f,
			'AcDb:Preview': 0x40aa0473, 'AcDb:AppInfo': 0x3fa0043e, 'AcDb:FileDepList': 0x6c4205ca,
			'AcDb:RevHistory': 0x60a205b3, 'AcDb:AcDbObjects': 0x674c05a9, 'AcDb:ObjFreeSpace': 0x77e2061f,
			'AcDb:Template': 0x4a1404ce, 'AcDb:Handles': 0x3f6e0450, 'AcDb:AuxHeader': 0x54f0050a,
		};
		const chunks: Uint8Array[] = [];
		for (const section of this.sections) {
			const name = new Uint8Array((section.name.length + 1) * 2), view = new DataView(name.buffer);
			for (let i = 0; i < section.name.length; i++) view.setUint16(i * 2, section.name.charCodeAt(i), true);
			chunks.push(r2007Words([section.data.length, 0xf800, 0, hashes[section.name] ?? 0, name.length, 0, 4, section.pages.length]), name);
			for (const { page, offset, data, stored } of section.pages) {
				chunks.push(r2007Words([offset, page.bytes.length, page.id, data.length, stored.length,
					r2007Checksum(data), r2007Crc(stored, r2007Seed(stored.length), true)]));
			}
		}
		const sectionData = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
		let position = 0;
		for (const chunk of chunks) { sectionData.set(chunk, position); position += chunk.length; }
		const sectionSystem = system(sectionData);
		const section1 = add(sectionSystem.bytes), section2 = add(sectionSystem.bytes);
		const pageData = r2007Words(pages.flatMap(p => [p.bytes.length, p.id]));
		const mapSystem = system(pageData);
		map1.bytes = map2.bytes = mapSystem.bytes;
		const offsets = new Map<number, number>(); position = 0;
		for (const page of pages) { offsets.set(page.id, position); position += page.bytes.length; }
		const random = new R2007Random();
		const sectionSeed = random.encodeZero(), pageSeed = random.encodeZero();
		const random1 = random.next(), random2 = random.next(), encodedSeed = random.encodeZero();
		const rotate = r2007Rotate;
		const normal = [rotate(random1, random2)];
		normal.push(rotate(normal[0], normal[0]), rotate(random2, rotate(normal[0], normal[0])));
		normal.push(rotate(normal[2], normal[2]), rotate(random1, rotate(normal[2], normal[2])));
		while (normal.length < 8) normal.push(rotate(normal[normal.length - 1], normal[normal.length - 1]));
		const normalCrc = r2007Crc(r2007Words(normal), ~random2);
		const mirrored = [rotate(random1, random2)];
		mirrored.push(rotate(normalCrc, mirrored[0])); mirrored.push(rotate(random2, mirrored[1]));
		mirrored.push(rotate(normalCrc, mirrored[2])); mirrored.push(rotate(random1, mirrored[3]));
		mirrored.push(rotate(normalCrc, mirrored[4])); mirrored.push(rotate(random2, mirrored[5]));
		mirrored.push(rotate(mirrored[6], mirrored[6]));
		const check = r2007Words([normalCrc, r2007Crc(r2007Words(mirrored), ~random1, true), random1, random2, encodedSeed]);
		const payload = r2007Words([
			0x70, 0x480 + position + 0x400, r2007Crc(pageData, r2007Seed(pageData.length), true), mapSystem.factor, pageSeed,
			offsets.get(map2.id)!, map2.id, 0, map1.id, position,
			pageData.length, pageData.length, pages.length, pages.length, 0x20, 0x40,
			r2007Crc(pageData, r2007Seed(pageData.length), true), 0xf800, 4, 1,
			this.sections.length + 1, r2007Crc(sectionData, r2007Seed(sectionData.length), true), sectionData.length,
			section2.id, section1.id, sectionData.length, r2007Crc(sectionData, r2007Seed(sectionData.length), true),
			sectionSystem.factor, sectionSeed, 0x60100, 0, random.encodeZero(), 0, 0,
		]);
		new DataView(payload.buffer).setBigUint64(0x108, r2007Crc(payload, r2007Seed(payload.length, true)), true);
		const key = random.next();
		const prefix = r2007Words([r2007Crc(r2007Words([key, rotate(key, key)]), r2007Seed(16)), key,
			r2007Crc(payload, r2007Seed(payload.length, true)), -payload.length]);
		const repeated = new Uint8Array(717), block = new Uint8Array(prefix.length + payload.length);
		block.set(prefix); block.set(payload, prefix.length);
		for (let p = 0; p + block.length <= repeated.length; p += block.length) repeated.set(block, p);
		const header = new Uint8Array(0x400); header.set(r2007ReedSolomon(repeated, 239)); header.set(check, 0x3d8);
		const metadata = new Uint8Array(0x80), mv = new DataView(metadata.buffer);
		metadata.set(new TextEncoder().encode('AC1021')); metadata[0xb] = 50; metadata[0xc] = 3;
		metadata[0x11] = 0x1b; metadata[0x12] = 50; mv.setUint16(0x13, this.getFileCodePage(), true);
		mv.setUint32(0x28, 0x80, true);
		for (const [name, address] of [['AcDb:Preview', 0xd], ['AcDb:SummaryInfo', 0x20], ['AcDb:AppInfo', 0x2c]] as const) {
			const page = this.sections.find(s => s.name === name)?.pages[0]?.page;
			if (page) mv.setUint32(address, 0x480 + offsets.get(page.id)!, true);
		}
		this.writeToStream(metadata); this.writeToStream(header);
		for (const page of pages) this.writeToStream(page.bytes);
		this.writeToStream(header);
	}
}
