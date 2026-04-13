import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';

import { FormattedTableData } from './LinkedData.js';

export class TableContent extends FormattedTableData {
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get objectName(): string { return DxfFileToken.ObjectTableContent; }
	override get subclassMarker(): string { return DxfSubclassMarker.TableContent; }

	style: any = null;
	styleOverride: any = null;
}
