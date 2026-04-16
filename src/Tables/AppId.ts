import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { TableEntry } from './TableEntry.js';

export class AppId extends TableEntry {
	public static get default(): AppId {
		return new AppId(AppId.defaultName);
	}

	public override get objectName(): string {
		return DxfFileToken.tableAppId;
	}

	public override get objectType(): ObjectType {
		return ObjectType.APPID;
	}

	public override get subclassMarker(): string {
		return DxfSubclassMarker.applicationId;
	}

	public static readonly blockRepBTag: string = 'AcDbBlockRepBTag';
	public static readonly blockRepETag: string = 'AcDbBlockRepETag';
	public static readonly defaultName: string = 'ACAD';

	public constructor(name?: string) {
		super(name);
		if (name !== undefined && !name) {
			throw new Error('Application id must have a name.');
		}
	}
}
