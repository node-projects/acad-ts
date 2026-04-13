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

	Dispose(): void {
		// No-op in TS
	}

	override Write(): void {
		this.WriteBlock(this._document.modelSpace);
	}

	WriteBlock(record: BlockRecord): void {
		this.createWriter();
		this._writer.WriteBlock(record);
	}

	WriteLayout(layout: Layout): void {
		this.createWriter();
		this._writer.WriteLayout(layout);
	}

	private createWriter(): void {
		this._writer = new SvgXmlWriter(this._stream, this._encoding, this.Configuration);
		this._writer.OnNotification = (sender, e) => this.triggerNotification(sender, e);
	}
}
