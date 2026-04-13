import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { BlockRecord } from '../BlockRecord.js';
import { Table } from './Table.js';

export class BlockRecordsTable extends Table<BlockRecord> {
	public override get objectType(): ObjectType {
		return ObjectType.BLOCK_CONTROL_OBJ;
	}

	public override get objectName(): string {
		return DxfFileToken.TableBlockRecord;
	}

	protected override get defaultEntries(): string[] {
		return [BlockRecord.ModelSpaceName, BlockRecord.PaperSpaceName];
	}

	public constructor() {
		super();
	}

	public override createDefaultEntries(): void {
		if (!this.contains(BlockRecord.ModelSpaceName)) {
			this.add(BlockRecord.ModelSpace);
		}
		if (!this.contains(BlockRecord.PaperSpaceName)) {
			this.add(BlockRecord.PaperSpace);
		}
	}

	public override add(item: BlockRecord): void {
		if (item.isAnonymous && this.contains(item.name)) {
			const existing = this.tryGetValue(item.name);
			if (existing && existing === item) {
				throw new Error(`The BlockRecord with name ${item.name} has already been added.`);
			}
			item.name = this.createName(BlockRecord.AnonymousPrefix);
		}

		super.add(item);
	}
}
