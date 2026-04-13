import { DwgLocalSectionMap } from './DwgLocalSectionMap.js';

export class DwgSectionDescriptor {
	readonly PageType: number = 0x4163043B;

	Name: string = '';

	CompressedSize: number = 0;

	PageCount: number = 0;

	DecompressedSize: number = 0x7400;

	private _compressed: number = 2;

	get CompressedCode(): number {
		return this._compressed;
	}
	set CompressedCode(value: number) {
		if (value === 1 || value === 2) {
			this._compressed = value;
		} else {
			throw new Error('Invalid compressed code');
		}
	}

	get IsCompressed(): boolean {
		return this._compressed === 2;
	}

	SectionId: number = 0;

	Encrypted: number = 0;

	HashCode: number | null = null;

	Encoding: number | null = null;

	LocalSections: DwgLocalSectionMap[] = [];

	constructor(name?: string) {
		if (name !== undefined) {
			this.Name = name;
		}
	}
}
