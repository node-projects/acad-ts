import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { AppId } from '../AppId.js';
import { Table } from './Table.js';

export class AppIdsTable extends Table<AppId> {
	public override get objectType(): ObjectType {
		return ObjectType.APPID_CONTROL_OBJ;
	}

	public override get objectName(): string {
		return DxfFileToken.tableAppId;
	}

	protected override get defaultEntries(): string[] {
		return [AppId.defaultName];
	}

	public override createDefaultEntries(): void {
		if (!this.contains(AppId.defaultName)) {
			this.add(AppId.default);
		}
	}

	public constructor() {
		super();
	}
}
