import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

import { FormattedTableData } from './LinkedData.js';
import { TableStyle } from './TableStyle.js';

export class TableContent extends FormattedTableData {
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get objectName(): string { return DxfFileToken.objectTableContent; }
	override get subclassMarker(): string { return DxfSubclassMarker.tableContent; }

	style: TableStyle | null = null;
	styleOverride: unknown = null;
}
