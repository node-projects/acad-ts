import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { AppId } from '../AppId.js';
import { Table } from './Table.js';

export class AppIdsTable extends Table<AppId> {
	public override get objectType(): ObjectType {
		return ObjectType.APPID_CONTROL_OBJ;
	}

	public override get objectName(): string {
		return DxfFileToken.TableAppId;
	}

	protected override get defaultEntries(): string[] {
		return [AppId.DefaultName];
	}

	public override createDefaultEntries(): void {
		if (!this.contains(AppId.DefaultName)) {
			this.add(AppId.Default);
		}
	}

	public constructor() {
		super();
	}
}
