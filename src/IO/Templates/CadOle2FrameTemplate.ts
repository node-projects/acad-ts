import { Ole2Frame } from '../../Entities/Ole2Frame.js';
import { XYZ } from '../../Math/XYZ.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';

export class CadOle2FrameTemplate extends CadEntityTemplateT<Ole2Frame> {
	chunks: Uint8Array[] = [];

	constructor(ole?: Ole2Frame) {
		super(ole ?? new Ole2Frame());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		if (this.chunks.length > 0) {
			const totalLength = this.chunks.reduce((sum, c) => sum + c.length, 0);
			const combined = new Uint8Array(totalLength);
			let offset = 0;
			for (const chunk of this.chunks) {
				combined.set(chunk, offset);
				offset += chunk.length;
			}
			this.cadObject.binaryData = combined;
		}

		if (this.cadObject.binaryData && this.cadObject.binaryData.length > 0) {
			const view = new DataView(this.cadObject.binaryData.buffer, this.cadObject.binaryData.byteOffset);
			let pos = 2; // skip 2 unknown bytes

			this.cadObject.upperLeftCorner = this._read3Double(view, pos);
			pos += 24;
			// upper right
			pos += 24;
			this.cadObject.lowerRightCorner = this._read3Double(view, pos);
		}
	}

	private _read3Double(view: DataView, offset: number): XYZ {
		const x = view.getFloat64(offset, true);
		const y = view.getFloat64(offset + 8, true);
		const z = view.getFloat64(offset + 16, true);
		return new XYZ(x, y, z);
	}
}
