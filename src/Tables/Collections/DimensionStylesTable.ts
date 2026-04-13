import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DimensionStyle } from '../DimensionStyle.js';
import { Table } from './Table.js';

export class DimensionStylesTable extends Table<DimensionStyle> {
	public override get objectType(): ObjectType {
		return ObjectType.DIMSTYLE_CONTROL_OBJ;
	}

	public override get objectName(): string {
		return DxfFileToken.TableDimstyle;
	}

	protected override get defaultEntries(): string[] {
		return [DimensionStyle.DefaultName];
	}

	public override createDefaultEntries(): void {
		if (!this.contains(DimensionStyle.DefaultName)) {
			this.add(DimensionStyle.Default);
		}
	}

	public constructor() {
		super();
	}
}
