import { BlockRecord } from '../../Tables/BlockRecord.js';
import { BlockRecordsTable } from '../../Tables/Collections/BlockRecordsTable.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTableTemplate } from './CadTableTemplate.js';

export class CadBlockCtrlObjectTemplate extends CadTableTemplate<BlockRecord> {
	ModelSpaceHandle: number | null = null;

	PaperSpaceHandle: number | null = null;

	constructor(blocks: BlockRecordsTable) {
		super(blocks);
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const modelSpace = builder.TryGetCadObject<BlockRecord>(this.ModelSpaceHandle);
		if (modelSpace) {
			this.CadObject.add(modelSpace);
		}

		const paperSpace = builder.TryGetCadObject<BlockRecord>(this.PaperSpaceHandle);
		if (paperSpace) {
			this.CadObject.add(paperSpace);
		}
	}
}
