import { DwgStreamWriterBase } from './DwgStreamWriterBase.js';

export class DwgStreamWriterAC12 extends DwgStreamWriterBase {
	constructor(stream: Uint8Array, encoding: string) {
		super(stream, encoding);
	}
}
