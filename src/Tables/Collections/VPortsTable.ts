import { ObjectType } from '../../Types/ObjectType.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { VPort } from '../VPort.js';
import { Table } from './Table.js';

export class VPortsTable extends Table<VPort> {
	public override get objectType(): ObjectType {
		return ObjectType.VPORT_CONTROL_OBJ;
	}

	public override get objectName(): string {
		return DxfFileToken.TableVport;
	}

	protected override get defaultEntries(): string[] {
		return [VPort.DefaultName];
	}

	public override createDefaultEntries(): void {
		if (!this.contains(VPort.DefaultName)) {
			this.add(VPort.Default);
		}
	}

	public constructor() {
		super();
	}

	public override add(item: VPort): void {
		if (this.contains(item.name)) {
			this.addHandlePrefix(item);
		} else {
			this.addEntry(item.name, item);
		}
	}
}
