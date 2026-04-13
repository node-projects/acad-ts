import { ObjectType } from '../../../Types/ObjectType.js';
import { DwgStreamReaderAC21 } from './DwgStreamReaderAC21.js';

export class DwgStreamReaderAC24 extends DwgStreamReaderAC21 {
	constructor(stream: Uint8Array, resetPosition: boolean) {
		super(stream, resetPosition);
	}

	public override readObjectType(): ObjectType {
		const pair: number = this.read2Bits();
		let value: number = 0;

		switch (pair) {
			case 0:
				value = this.readByte();
				break;
			case 1:
				value = 0x1F0 + this.readByte();
				break;
			case 2:
				value = this.readShort();
				break;
			case 3:
				value = this.readShort();
				break;
		}

		return value as ObjectType;
	}
}
