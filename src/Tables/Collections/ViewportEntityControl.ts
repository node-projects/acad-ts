import { ObjectType } from '../../Types/ObjectType.js';
import { ViewportEntityHeader } from '../ViewportEntityHeader.js';
import { Table } from './Table.js';

export class ViewportEntityControl extends Table<ViewportEntityHeader> {
	public override get objectType(): ObjectType {
		return ObjectType.VP_ENT_HDR_CTRL_OBJ;
	}

	protected override get defaultEntries(): string[] {
		return [];
	}

	public constructor() {
		super();
	}
}
