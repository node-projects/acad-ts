export class DwgSectionLocatorRecord {
	number: number | null = null;
	seeker: number = 0;
	size: number = 0;
	stream: Uint8Array | null = null;

	constructor(number?: number | null, seeker?: number, size?: number) {
		if (number !== undefined) {
			this.number = number ?? null;
		}
		if (seeker !== undefined) {
			this.seeker = seeker;
		}
		if (size !== undefined) {
			this.size = size;
		}
	}

	isInTheRecord(position: number): boolean {
		return position >= this.seeker && position < this.seeker + this.size;
	}

	toString(): string {
		return `Number : ${this.number} | Seeker : ${this.seeker} | Size : ${this.size}`;
	}
}
