export class DwgLocalSectionMap {
	Compression: number = 2;
	IsEmpty: boolean = false;
	Offset: number = 0;
	CompressedSize: number = 0;
	PageNumber: number = 0;
	DecompressedSize: number = 0;
	Seeker: number = 0;
	Size: number = 0;
	Checksum: number = 0;
	CRC: number = 0;
	PageSize: number = 0;
	ODA: number = 0;
	SectionMap: number = 0;

	constructor(value?: number) {
		if (value !== undefined) {
			this.SectionMap = value;
		}
	}
}
