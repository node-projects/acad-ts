import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { LineType } from '../LineType.js';
import { Table } from './Table.js';

export class LineTypesTable extends Table<LineType> {
	public override get objectType(): ObjectType {
		return ObjectType.LTYPE_CONTROL_OBJ;
	}

	public override get objectName(): string {
		return DxfFileToken.TableLinetype;
	}

	public get byLayer(): LineType {
		return this.get(LineType.ByLayerName);
	}

	public get byBlock(): LineType {
		return this.get(LineType.ByBlockName);
	}

	public get continuous(): LineType {
		return this.get(LineType.ContinuousName);
	}

	protected override get defaultEntries(): string[] {
		return [LineType.ByLayerName, LineType.ByBlockName, LineType.ContinuousName];
	}

	public constructor() {
		super();
	}

	public override createDefaultEntries(): void {
		if (!this.contains(LineType.ByLayerName)) {
			this.add(LineType.ByLayer);
		}
		if (!this.contains(LineType.ByBlockName)) {
			this.add(LineType.ByBlock);
		}
		if (!this.contains(LineType.ContinuousName)) {
			this.add(LineType.Continuous);
		}
	}
}
