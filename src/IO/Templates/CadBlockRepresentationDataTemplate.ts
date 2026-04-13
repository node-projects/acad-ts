import { BlockRepresentationData } from '../../Objects/BlockRepresentationData.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadBlockRepresentationDataTemplate extends CadTemplateT<BlockRepresentationData> {
	BlockHandle: number | null = null;

	constructor(representation?: BlockRepresentationData) {
		super(representation ?? new BlockRepresentationData());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const record = this.getTableReference<BlockRecord>(builder, this.BlockHandle, '');
		if (record) {
			this.CadObject.block = record;
		}
	}
}
