import { DimensionStyle } from '../../Tables/DimensionStyle.js';
import { TextStyle } from '../../Tables/TextStyle.js';
import { LineType } from '../../Tables/LineType.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';

export class CadDimensionStyleTemplate extends CadTableEntryTemplate<DimensionStyle> {
	DIMBL_Name: string | null = null;

	DIMBLK: number | null = null;

	DIMBLK1: number | null = null;

	DIMBLK1_Name: string | null = null;

	DIMBLK2: number | null = null;

	DIMBLK2_Name: string | null = null;

	DIMLDRBLK: number | null = null;

	Dimltex1: number = 0;

	Dimltex2: number = 0;

	Dimltype: number | null = null;

	TextStyle_Name: string | null = null;

	TextStyleHandle: number | null = null;

	BlockHandle: number | null = null;

	DxfFlagsAssigned: boolean = false;

	constructor(dimStyle?: DimensionStyle) {
		super(dimStyle ?? new DimensionStyle());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const style = this.getTableReference<TextStyle>(builder, this.TextStyleHandle, this.TextStyle_Name ?? '');
		if (style) {
			this.CadObject.style = style;
		}

		const linetType = this.getTableReference<LineType>(builder, this.Dimltype, '');
		if (linetType) {
			this.CadObject.lineType = linetType;
		}

		const linetTypeEx1 = this.getTableReference<LineType>(builder, this.Dimltex1, '');
		if (linetTypeEx1) {
			this.CadObject.lineTypeExt1 = linetTypeEx1;
		}

		const linetTypeEx2 = this.getTableReference<LineType>(builder, this.Dimltex2, '');
		if (linetTypeEx2) {
			this.CadObject.lineTypeExt2 = linetTypeEx2;
		}

		const leaderArrow = this.getTableReference<BlockRecord>(builder, this.DIMLDRBLK, this.DIMBL_Name ?? '');
		if (leaderArrow) {
			this.CadObject.leaderArrow = leaderArrow;
		}

		const dimArrow1 = this.getTableReference<BlockRecord>(builder, this.DIMBLK1, this.DIMBLK1_Name ?? '');
		if (dimArrow1) {
			this.CadObject.dimArrow1 = dimArrow1;
		}

		const dimArrow2 = this.getTableReference<BlockRecord>(builder, this.DIMBLK2, this.DIMBLK2_Name ?? '');
		if (dimArrow2) {
			this.CadObject.dimArrow2 = dimArrow2;
		}

		const external = this.getTableReference<BlockRecord>(builder, this.BlockHandle, '');
	}
}
