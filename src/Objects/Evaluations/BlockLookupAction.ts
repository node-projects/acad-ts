import { BlockAction } from './BlockAction.js';
import { DxfFileToken } from '../../DxfFileToken.js';
import { DxfSubclassMarker } from '../../DxfSubclassMarker.js';

export class BlockLookupActionColumnData {
	connectionName: string = '';
	isLookupProperty: boolean = false;
	isReadOnly: boolean = false;
	nodeId: number = 0;
	rows: string[] = [];
	type: number = 0;
	unmatchedName: string = '';
	valueType: number = 0;
}

export class BlockLookupAction extends BlockAction {
	columns: BlockLookupActionColumnData[] = [];
	unknownFlag: boolean = false;
	override get objectName(): string { return DxfFileToken.objectBlockLookupAction; }
	override get subclassMarker(): string { return DxfSubclassMarker.blockLookupAction; }
}
