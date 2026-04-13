import { ACadVersion } from '../../../ACadVersion.js';
import { DwgSectionDescriptor } from './DwgSectionDescriptor.js';

// Factory registration for breaking circular dependency
let _factory: ((version: ACadVersion) => DwgFileHeader | null) | null = null;

export abstract class DwgFileHeader {
	readonly AcadVersion: ACadVersion;

	PreviewAddress: number = -1;

	AcadMaintenanceVersion: number = 0;

	DrawingCodePage: number = 0;

	constructor(version?: ACadVersion) {
		this.AcadVersion = version ?? ACadVersion.Unknown;
	}

	static registerFactory(factory: (version: ACadVersion) => DwgFileHeader | null): void {
		_factory = factory;
	}

	static CreateFileHeader(version: ACadVersion): DwgFileHeader | null {
		if (!_factory) {
			throw new Error('DwgFileHeader factory not registered. Import DwgFileHeaderFactory first.');
		}
		return _factory(version);
	}

	abstract AddSection(name: string): void;

	abstract GetDescriptor(name: string): DwgSectionDescriptor;
}
