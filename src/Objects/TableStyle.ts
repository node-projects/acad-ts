import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { CellStyle } from '../Entities/TableEntity.js';
import { TableFlowDirectionType } from './TableFlowDirectionType.js';

export class TableStyle extends NonGraphicalObject {
	static get default_(): TableStyle { return new TableStyle(TableStyle.DefaultName); }

	cellStyles: CellStyle[] = [];
	dataCellStyle: CellStyle = new CellStyle();
	description: string = '';
	flags: number = 0;
	flowDirection: TableFlowDirectionType = TableFlowDirectionType.Down;
	headerCellStyle: CellStyle = new CellStyle();
	horizontalCellMargin: number = 0.06;

	override get objectName(): string { return DxfFileToken.ObjectTableStyle; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get subclassMarker(): string { return DxfSubclassMarker.TableStyle; }

	suppressHeaderRow: boolean = false;
	suppressTitle: boolean = false;
	tableCellStyle: CellStyle = new CellStyle();
	titleCellStyle: CellStyle = new CellStyle();
	verticalCellMargin: number = 0.06;

	static readonly DefaultName = 'Standard';

	constructor(name: string = '') {
		super(name);
	}
}

export { TableFlowDirectionType } from './TableFlowDirectionType.js';
