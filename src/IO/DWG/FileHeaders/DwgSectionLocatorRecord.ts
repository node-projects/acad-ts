export class DwgSectionLocatorRecord {
	Number: number | null = null;
	Seeker: number = 0;
	Size: number = 0;
	Stream: Uint8Array | null = null;

	constructor(number?: number | null, seeker?: number, size?: number) {
		if (number !== undefined) {
			this.Number = number ?? null;
		}
		if (seeker !== undefined) {
			this.Seeker = seeker;
		}
		if (size !== undefined) {
			this.Size = size;
		}
	}

	IsInTheRecord(position: number): boolean {
		return position >= this.Seeker && position < this.Seeker + this.Size;
	}

	toString(): string {
		return `Number : ${this.Number} | Seeker : ${this.Seeker} | Size : ${this.Size}`;
	}
}
