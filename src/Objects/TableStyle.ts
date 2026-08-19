import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { CellStyle } from '../Entities/TableEntity.js';
import { TableFlowDirectionType } from './TableFlowDirectionType.js';

export class TableStyle extends NonGraphicalObject {
	static get default_(): TableStyle { return new TableStyle(TableStyle.defaultName); }

	cellStyles: CellStyle[] = [];
	dataCellStyle: CellStyle = new CellStyle();
	description: string = '';
	flags: number = 0;
	flowDirection: TableFlowDirectionType = TableFlowDirectionType.Down;
	headerCellStyle: CellStyle = new CellStyle();
	horizontalCellMargin: number = 0.06;

	override get objectName(): string { return DxfFileToken.objectTableStyle; }
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get subclassMarker(): string { return DxfSubclassMarker.tableStyle; }

	suppressHeaderRow: boolean = false;
	suppressTitle: boolean = false;
	tableCellStyle: CellStyle = TableStyle.createDefaultCellStyle('Table', 4);
	titleCellStyle: CellStyle = new CellStyle();
	verticalCellMargin: number = 0.06;

	static readonly defaultName = 'Standard';

	constructor(name: string = '') {
		super(name);
	}

	static createDefaultCellStyle(name: string, id: number): CellStyle {
		const style = new CellStyle();
		style.name = name;
		style.id = id;
		style.hasData = true;
		return style;
	}
}

export { TableFlowDirectionType } from './TableFlowDirectionType.js';
