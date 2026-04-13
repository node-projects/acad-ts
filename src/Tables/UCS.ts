import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { OrthographicType } from '../Types/OrthographicType.js';
import { TableEntry } from './TableEntry.js';
import { XYZ } from '../Math/XYZ.js';

export class UCS extends TableEntry {
	public override get objectType(): ObjectType {
		return ObjectType.UCS;
	}

	public override get objectName(): string {
		return DxfFileToken.TableUcs;
	}

	public override get subclassMarker(): string {
		return DxfSubclassMarker.Ucs;
	}

	public origin: XYZ = new XYZ(0, 0, 0);

	public xAxis: XYZ = new XYZ(1, 0, 0);

	public yAxis: XYZ = new XYZ(0, 1, 0);

	public orthographicType: OrthographicType = OrthographicType.None;

	public orthographicViewType: OrthographicType = OrthographicType.None;

	public elevation: number = 0;

	public constructor(name?: string) {
		super(name);
	}
}

export { OrthographicType } from '../Types/OrthographicType.js';
