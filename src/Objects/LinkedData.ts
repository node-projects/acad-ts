import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { CellRange, CellStyle } from '../Entities/TableEntity.js';

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

	rows: unknown[] = [];
	columns: unknown[] = [];
}

export abstract class FormattedTableData extends LinkedTableData {
	override get subclassMarker(): string {
		return DxfSubclassMarker.formattedTableData;
	}

	mergedCellRanges: CellRange[] = [];
	cellStyleOverride: CellStyle = new CellStyle();
}
