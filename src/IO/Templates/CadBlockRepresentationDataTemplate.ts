import { BlockRepresentationData } from '../../Objects/BlockRepresentationData.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadBlockRepresentationDataTemplate extends CadTemplateT<BlockRepresentationData> {
	blockHandle: number | null = null;

	constructor(representation?: BlockRepresentationData) {
		super(representation ?? new BlockRepresentationData());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const record = this.getTableReference<BlockRecord>(builder, this.blockHandle, '');
		if (record) {
			this.cadObject.block = record;
		}
	}
}
