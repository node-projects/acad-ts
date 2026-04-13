import { DwgStreamReaderBase } from './DwgStreamReaderBase.js';

export class DwgStreamReaderAC12 extends DwgStreamReaderBase {
	constructor(stream: Uint8Array, resetPosition: boolean) {
		super(stream, resetPosition);
	}
}
