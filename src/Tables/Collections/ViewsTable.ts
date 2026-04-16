import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { View } from '../View.js';
import { Table } from './Table.js';

export class ViewsTable extends Table<View> {
	public override get objectType(): ObjectType {
		return ObjectType.VIEW_CONTROL_OBJ;
	}

	public override get objectName(): string {
		return DxfFileToken.tableView;
	}

	protected override get defaultEntries(): string[] {
		return [];
	}

	public constructor() {
		super();
	}
}
