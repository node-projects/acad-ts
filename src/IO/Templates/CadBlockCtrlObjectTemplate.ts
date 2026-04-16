import { BlockRecord } from '../../Tables/BlockRecord.js';
import { BlockRecordsTable } from '../../Tables/Collections/BlockRecordsTable.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTableTemplate } from './CadTableTemplate.js';

export class CadBlockCtrlObjectTemplate extends CadTableTemplate<BlockRecord> {
	modelSpaceHandle: number | null = null;

	paperSpaceHandle: number | null = null;

	constructor(blocks: BlockRecordsTable) {
		super(blocks);
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const modelSpace = builder.tryGetCadObject<BlockRecord>(this.modelSpaceHandle);
		if (modelSpace) {
			this.cadObject.add(modelSpace);
		}

		const paperSpace = builder.tryGetCadObject<BlockRecord>(this.paperSpaceHandle);
		if (paperSpace) {
			this.cadObject.add(paperSpace);
		}
	}
}
