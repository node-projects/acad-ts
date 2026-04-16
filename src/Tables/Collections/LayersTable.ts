import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { Layer } from '../Layer.js';
import { LineType } from '../LineType.js';
import { Table } from './Table.js';

export class LayersTable extends Table<Layer> {
	public override get objectType(): ObjectType {
		return ObjectType.LAYER_CONTROL_OBJ;
	}

	public override get objectName(): string {
		return DxfFileToken.tableLayer;
	}

	protected override get defaultEntries(): string[] {
		return [Layer.defaultName];
	}

	public constructor() {
		super();
	}

	public override createDefaultEntries(): void {
		if (!this.contains(Layer.defaultName)) {
			const layer = Layer.default;
			layer.lineType = LineType.continuous;
			this.add(layer);
		}
	}
}
