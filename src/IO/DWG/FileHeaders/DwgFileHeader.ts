import { ACadVersion } from '../../../ACadVersion.js';
import { DwgSectionDescriptor } from './DwgSectionDescriptor.js';

// Factory registration for breaking circular dependency
let _factory: ((version: ACadVersion) => DwgFileHeader | null) | null = null;

export abstract class DwgFileHeader {
	readonly acadVersion: ACadVersion;

	previewAddress: number = -1;

	acadMaintenanceVersion: number = 0;

	drawingCodePage: number = 0;

	constructor(version?: ACadVersion) {
		this.acadVersion = version ?? ACadVersion.Unknown;
	}

	static registerFactory(factory: (version: ACadVersion) => DwgFileHeader | null): void {
		_factory = factory;
	}

	static createFileHeader(version: ACadVersion): DwgFileHeader | null {
		if (!_factory) {
			throw new Error('DwgFileHeader factory not registered. Import DwgFileHeaderFactory first.');
		}
		return _factory(version);
	}

	abstract addSection(name: string): void;

	abstract getDescriptor(name: string): DwgSectionDescriptor;
}
