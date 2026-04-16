import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { LineType } from '../LineType.js';
import { Table } from './Table.js';

export class LineTypesTable extends Table<LineType> {
	public override get objectType(): ObjectType {
		return ObjectType.LTYPE_CONTROL_OBJ;
	}

	public override get objectName(): string {
		return DxfFileToken.tableLinetype;
	}

	public get byLayer(): LineType {
		return this.get(LineType.byLayerName);
	}

	public get byBlock(): LineType {
		return this.get(LineType.byBlockName);
	}

	public get continuous(): LineType {
		return this.get(LineType.continuousName);
	}

	protected override get defaultEntries(): string[] {
		return [LineType.byLayerName, LineType.byBlockName, LineType.continuousName];
	}

	public constructor() {
		super();
	}

	public override createDefaultEntries(): void {
		if (!this.contains(LineType.byLayerName)) {
			this.add(LineType.byLayer);
		}
		if (!this.contains(LineType.byBlockName)) {
			this.add(LineType.byBlock);
		}
		if (!this.contains(LineType.continuousName)) {
			this.add(LineType.continuous);
		}
	}
}
