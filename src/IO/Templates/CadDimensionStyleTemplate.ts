import { DimensionStyle } from '../../Tables/DimensionStyle.js';
import { TextStyle } from '../../Tables/TextStyle.js';
import { LineType } from '../../Tables/LineType.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';

export class CadDimensionStyleTemplate extends CadTableEntryTemplate<DimensionStyle> {
	dimbL_Name: string | null = null;

	dimblk: number | null = null;

	dimblk1: number | null = null;

	dimblK1_Name: string | null = null;

	dimblk2: number | null = null;

	dimblK2_Name: string | null = null;

	dimldrblk: number | null = null;

	dimltex1: number = 0;

	dimltex2: number = 0;

	dimltype: number | null = null;

	textStyle_Name: string | null = null;

	textStyleHandle: number | null = null;

	blockHandle: number | null = null;

	dxfFlagsAssigned: boolean = false;

	constructor(dimStyle?: DimensionStyle) {
		super(dimStyle ?? new DimensionStyle());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const style = this.getTableReference<TextStyle>(builder, this.textStyleHandle, this.textStyle_Name ?? '');
		if (style) {
			this.cadObject.style = style;
		}

		const linetType = this.getTableReference<LineType>(builder, this.dimltype, '');
		if (linetType) {
			this.cadObject.lineType = linetType;
		}

		const linetTypeEx1 = this.getTableReference<LineType>(builder, this.dimltex1, '');
		if (linetTypeEx1) {
			this.cadObject.lineTypeExt1 = linetTypeEx1;
		}

		const linetTypeEx2 = this.getTableReference<LineType>(builder, this.dimltex2, '');
		if (linetTypeEx2) {
			this.cadObject.lineTypeExt2 = linetTypeEx2;
		}

		const leaderArrow = this.getTableReference<BlockRecord>(builder, this.dimldrblk, this.dimbL_Name ?? '');
		if (leaderArrow) {
			this.cadObject.leaderArrow = leaderArrow;
		}

		const dimArrow1 = this.getTableReference<BlockRecord>(builder, this.dimblk1, this.dimblK1_Name ?? '');
		if (dimArrow1) {
			this.cadObject.dimArrow1 = dimArrow1;
		}

		const dimArrow2 = this.getTableReference<BlockRecord>(builder, this.dimblk2, this.dimblK2_Name ?? '');
		if (dimArrow2) {
			this.cadObject.dimArrow2 = dimArrow2;
		}

		const external = this.getTableReference<BlockRecord>(builder, this.blockHandle, '');
	}
}
