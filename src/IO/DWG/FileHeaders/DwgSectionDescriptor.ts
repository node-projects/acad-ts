import { DwgLocalSectionMap } from './DwgLocalSectionMap.js';

export class DwgSectionDescriptor {
	readonly pageType: number = 0x4163043B;

	name: string = '';

	compressedSize: number = 0;

	pageCount: number = 0;

	decompressedSize: number = 0x7400;

	private _compressed: number = 2;

	get compressedCode(): number {
		return this._compressed;
	}
	set compressedCode(value: number) {
		if (value === 1 || value === 2) {
			this._compressed = value;
		} else {
			throw new Error('Invalid compressed code');
		}
	}

	get isCompressed(): boolean {
		return this._compressed === 2;
	}

	sectionId: number = 0;

	encrypted: number = 0;

	hashCode: number | null = null;

	encoding: number | null = null;

	localSections: DwgLocalSectionMap[] = [];

	constructor(name?: string) {
		if (name !== undefined) {
			this.name = name;
		}
	}
}
