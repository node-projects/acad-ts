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
		return DxfFileToken.TableLayer;
	}

	protected override get defaultEntries(): string[] {
		return [Layer.DefaultName];
	}

	public constructor() {
		super();
	}

	public override createDefaultEntries(): void {
		if (!this.contains(Layer.DefaultName)) {
			const layer = Layer.Default;
			layer.lineType = LineType.Continuous;
			this.add(layer);
		}
	}
}
