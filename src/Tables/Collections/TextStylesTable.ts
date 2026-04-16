import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { TextStyle } from '../TextStyle.js';
import { Table } from './Table.js';

export class TextStylesTable extends Table<TextStyle> {
	public override get objectType(): ObjectType {
		return ObjectType.STYLE_CONTROL_OBJ;
	}

	public override get objectName(): string {
		return DxfFileToken.tableStyle;
	}

	protected override get defaultEntries(): string[] {
		return [TextStyle.defaultName];
	}

	public override createDefaultEntries(): void {
		if (!this.contains(TextStyle.defaultName)) {
			this.add(TextStyle.default);
		}
	}

	public constructor() {
		super();
	}
}
