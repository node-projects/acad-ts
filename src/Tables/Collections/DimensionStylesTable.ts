import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DimensionStyle } from '../DimensionStyle.js';
import { Table } from './Table.js';

export class DimensionStylesTable extends Table<DimensionStyle> {
	public override get objectType(): ObjectType {
		return ObjectType.DIMSTYLE_CONTROL_OBJ;
	}

	public override get objectName(): string {
		return DxfFileToken.tableDimstyle;
	}

	protected override get defaultEntries(): string[] {
		return [DimensionStyle.defaultName];
	}

	public override createDefaultEntries(): void {
		if (!this.contains(DimensionStyle.defaultName)) {
			this.add(DimensionStyle.default);
		}
	}

	public constructor() {
		super();
	}
}
