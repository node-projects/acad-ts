import { XYZ } from '../../../Math/index.js';
import { DwgStreamWriterAC12 } from './DwgStreamWriterAC12.js';

export class DwgStreamWriterAC15 extends DwgStreamWriterAC12 {
	constructor(stream: Uint8Array, encoding: string) {
		super(stream, encoding);
	}

	override writeBitExtrusion(normal: XYZ): void {
		//For R2000, this is a single bit, followed optionally by 3BD.
		if (normal.x === 0 && normal.y === 0 && normal.z === 1) {
			//If the single bit is 1,
			//the extrusion value is assumed to be 0,0,1 and no explicit extrusion is stored.
			super.writeBit(true);
			return;
		}

		//If the single bit is 0,
		super.writeBit(false);
		//then it will be followed by 3BD.
		super.write3BitDouble(normal);
	}

	override writeBitThickness(thickness: number): void {
		//For R2000+, this is a single bit followed optionally by a BD.
		//If the bit is one, the thickness value is assumed to be 0.0.
		//If the bit is 0, then a BD that represents the thickness follows.
		if (thickness === 0.0) {
			super.writeBit(true);
			return;
		}

		super.writeBit(false);
		super.writeBitDouble(thickness);
	}
}
