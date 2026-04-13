import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { TableEntry } from './TableEntry.js';

export class AppId extends TableEntry {
	public static get Default(): AppId {
		return new AppId(AppId.DefaultName);
	}

	public override get objectName(): string {
		return DxfFileToken.TableAppId;
	}

	public override get objectType(): ObjectType {
		return ObjectType.APPID;
	}

	public override get subclassMarker(): string {
		return DxfSubclassMarker.ApplicationId;
	}

	public static readonly BlockRepBTag: string = 'AcDbBlockRepBTag';
	public static readonly BlockRepETag: string = 'AcDbBlockRepETag';
	public static readonly DefaultName: string = 'ACAD';

	public constructor(name?: string) {
		super(name);
		if (name !== undefined && !name) {
			throw new Error('Application id must have a name.');
		}
	}
}
