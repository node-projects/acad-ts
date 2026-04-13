import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';

export abstract class LinkedData extends NonGraphicalObject {
	override get subclassMarker(): string {
		return DxfSubclassMarker.LinkedData;
	}

	description: string = '';
}

export abstract class LinkedTableData extends LinkedData {
	override get subclassMarker(): string {
		return DxfSubclassMarker.LinkedTableData;
	}

	rows: any[] = [];
	columns: any[] = [];
}

export abstract class FormattedTableData extends LinkedTableData {
	override get subclassMarker(): string {
		return DxfSubclassMarker.FormattedTableData;
	}

	mergedCellRanges: any[] = [];
	cellStyleOverride: any = {};
}
