import { XYZ } from '../../../Math/index.js';
import { DwgStreamReaderAC12 } from './DwgStreamReaderAC12.js';

export class DwgStreamReaderAC15 extends DwgStreamReaderAC12 {
	constructor(stream: Uint8Array, resetPosition: boolean) {
		super(stream, resetPosition);
	}

	public override readBitExtrusion(): XYZ {
		return this.readBit() ? XYZ.AxisZ : this.read3BitDouble();
	}

	public override readBitThickness(): number {
		return this.readBit() ? 0.0 : this.readBitDouble();
	}
}
