export class DwgLocalSectionMap {
	compression: number = 2;
	isEmpty: boolean = false;
	offset: number = 0;
	compressedSize: number = 0;
	pageNumber: number = 0;
	decompressedSize: number = 0;
	seeker: number = 0;
	size: number = 0;
	checksum: number = 0;
	crc: number = 0;
	pageSize: number = 0;
	oda: number = 0;
	sectionMap: number = 0;

	constructor(value?: number) {
		if (value !== undefined) {
			this.sectionMap = value;
		}
	}
}
