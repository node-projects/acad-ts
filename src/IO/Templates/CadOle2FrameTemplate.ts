import { Ole2Frame } from '../../Entities/Ole2Frame.js';
import { XYZ } from '../../Math/XYZ.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';

export class CadOle2FrameTemplate extends CadEntityTemplateT<Ole2Frame> {
	Chunks: Uint8Array[] = [];

	constructor(ole?: Ole2Frame) {
		super(ole ?? new Ole2Frame());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		if (this.Chunks.length > 0) {
			const totalLength = this.Chunks.reduce((sum, c) => sum + c.length, 0);
			const combined = new Uint8Array(totalLength);
			let offset = 0;
			for (const chunk of this.Chunks) {
				combined.set(chunk, offset);
				offset += chunk.length;
			}
			this.CadObject.binaryData = combined;
		}

		if (this.CadObject.binaryData && this.CadObject.binaryData.length > 0) {
			const view = new DataView(this.CadObject.binaryData.buffer, this.CadObject.binaryData.byteOffset);
			let pos = 2; // skip 2 unknown bytes

			this.CadObject.upperLeftCorner = this.read3Double(view, pos);
			pos += 24;
			// upper right
			pos += 24;
			this.CadObject.lowerRightCorner = this.read3Double(view, pos);
		}
	}

	private read3Double(view: DataView, offset: number): XYZ {
		const x = view.getFloat64(offset, true);
		const y = view.getFloat64(offset + 8, true);
		const z = view.getFloat64(offset + 16, true);
		return new XYZ(x, y, z);
	}
}
