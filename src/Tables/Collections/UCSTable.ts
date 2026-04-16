import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { UCS } from '../UCS.js';
import { Table } from './Table.js';

export class UCSTable extends Table<UCS> {
	public override get objectType(): ObjectType {
		return ObjectType.UCS_CONTROL_OBJ;
	}

	public override get objectName(): string {
		return DxfFileToken.tableUcs;
	}

	protected override get defaultEntries(): string[] {
		return [];
	}

	public constructor() {
		super();
	}
}
