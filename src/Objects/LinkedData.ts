import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { CellRange, CellStyle } from '../Entities/TableEntity.js';
import type { CadObject } from '../CadObject.js';
import { TableEntityRow, TableEntityColumn } from '../Entities/TableEntity.js';
import { tableOwnedList } from '../Entities/TableOwnedList.js';

export abstract class LinkedData extends NonGraphicalObject {
	override get subclassMarker(): string {
		return DxfSubclassMarker.linkedData;
	}

	description: string = '';
}

export abstract class LinkedTableData extends LinkedData {
	override get subclassMarker(): string {
		return DxfSubclassMarker.linkedTableData;
	}

	rows: TableEntityRow[] = tableOwnedList(() => this);
	columns: TableEntityColumn[] = tableOwnedList(() => this);
	override clone(): CadObject {
		const copy = super.clone() as LinkedTableData;
		copy.rows = tableOwnedList(() => copy); copy.columns = tableOwnedList(() => copy);
		copy.rows.push(...this.rows.map(item => item.clone()));
		copy.columns.push(...this.columns.map(item => item.clone()));
		return copy;
	}
}

export abstract class FormattedTableData extends LinkedTableData {
	override clone(): CadObject {
		const copy = super.clone() as FormattedTableData;
		copy.mergedCellRanges = this.mergedCellRanges.map(item => item.clone());
		copy.cellStyleOverride = this.cellStyleOverride.clone(); copy.cellStyleOverride.owner = copy;
		return copy;
	}
	override get subclassMarker(): string {
		return DxfSubclassMarker.formattedTableData;
	}

	mergedCellRanges: CellRange[] = [];
	cellStyleOverride: CellStyle = new CellStyle();
}
