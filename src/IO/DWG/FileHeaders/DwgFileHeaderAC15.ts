import { ACadVersion } from '../../../ACadVersion.js';
import { DwgFileHeader } from './DwgFileHeader.js';
import { DwgSectionDefinition } from './DwgSectionDefinition.js';
import { DwgSectionDescriptor } from './DwgSectionDescriptor.js';
import { DwgSectionLocatorRecord } from './DwgSectionLocatorRecord.js';

export class DwgFileHeaderAC15 extends DwgFileHeader {
	static readonly endSentinel: Uint8Array = new Uint8Array([0x95, 0xA0, 0x4E, 0x28, 0x99, 0x82, 0x1A, 0xE5, 0x5E, 0x41, 0xE0, 0x5F, 0x9D, 0x3A, 0x4D, 0x00]);

	records: Map<number, DwgSectionLocatorRecord> = new Map();
	private _descriptors: Map<string, DwgSectionDescriptor> = new Map();

	constructor(version?: ACadVersion) {
		super(version);
	}

	addSection(name: string): void {
		if (!this._descriptors.has(name)) {
			this._descriptors.set(name, new DwgSectionDescriptor(name));
		}
	}

	getDescriptor(name: string): DwgSectionDescriptor {
		const existing = this._descriptors.get(name);
		if (existing) {
			return existing;
		}

		const descriptor = new DwgSectionDescriptor(name);
		const sectionLocator = DwgSectionDefinition.getSectionLocatorByName(name);
		if (sectionLocator !== null) {
			const record = this.records.get(sectionLocator);
			if (record) {
				descriptor.compressedSize = record.size;
				descriptor.decompressedSize = record.size;
				descriptor.pageCount = 1;
				descriptor.compressedCode = 1;
			}
		}

		this._descriptors.set(name, descriptor);
		return descriptor;
	}
}
