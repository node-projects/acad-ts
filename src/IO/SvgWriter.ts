import { CadDocument } from '../CadDocument.js';
import { Layout } from '../Objects/Layout.js';
import { BlockRecord } from '../Tables/BlockRecord.js';
import { SvgConfiguration } from './SVG/SvgConfiguration.js';
import { SvgXmlWriter } from './SVG/SvgXmlWriter.js';
import { CadWriterBase } from './CadWriterBase.js';
import { CadWriterConfiguration } from './CadWriterConfiguration.js';

export class SvgWriter extends CadWriterBase<SvgConfiguration> {
	private _writer!: SvgXmlWriter;

	constructor(stream: ArrayBuffer | Uint8Array, document?: CadDocument | null) {
		super(stream, document!);
	}

	protected createDefaultConfiguration(): SvgConfiguration {
		return new SvgConfiguration();
	}

	dispose(): void {
		// No-op in TS
	}

	override write(): void {
		this.writeBlock(this._document.modelSpace);
	}

	writeBlock(record: BlockRecord): void {
		this._createWriter();
		this._writer.writeBlock(record);
	}

	writeLayout(layout: Layout): void {
		this._createWriter();
		this._writer.writeLayout(layout);
	}

	private _createWriter(): void {
		this._writer = new SvgXmlWriter(this._stream, this._encoding, this.configuration);
		this._writer.onNotification = (sender, e) => this.triggerNotification(sender, e);
	}
}
