import * as fs from 'fs';

export class DwgPreview {
	public readonly code: DwgPreview.PreviewType;
	public readonly rawHeader: Uint8Array;
	public readonly rawImage: Uint8Array;

	constructor();
	constructor(code: DwgPreview.PreviewType, rawHeader: Uint8Array, rawImage: Uint8Array);
	constructor(code?: DwgPreview.PreviewType, rawHeader?: Uint8Array, rawImage?: Uint8Array) {
		this.code = code ?? DwgPreview.PreviewType.Unknown;
		this.rawHeader = rawHeader ?? new Uint8Array(0);
		this.rawImage = rawImage ?? new Uint8Array(0);
	}

	public save(path: string): void {
		let writeHeader = false;

		switch (this.code) {
			case DwgPreview.PreviewType.Bmp:
			case DwgPreview.PreviewType.Wmf:
			case DwgPreview.PreviewType.Png:
				writeHeader = false;
				break;
			case DwgPreview.PreviewType.Unknown:
			default:
				throw new Error(`Preview with code ${this.code} not supported.`);
		}

		if (writeHeader && this.rawHeader.length > 0) {
			const data = new Uint8Array(this.rawHeader.length + this.rawImage.length);
			data.set(this.rawHeader);
			data.set(this.rawImage, this.rawHeader.length);
			fs.writeFileSync(path, data);
			return;
		}

		fs.writeFileSync(path, this.rawImage);
	}
}

export namespace DwgPreview {
	export enum PreviewType {
		Unknown = 0,
		Bmp = 2,
		Wmf = 3,
		Png = 6,
	}
}
