import { Dimension, DimensionType } from '../../Entities/Dimension.js';
import { DimensionAligned } from '../../Entities/DimensionAligned.js';
import { DimensionLinear } from '../../Entities/DimensionLinear.js';
import { DimensionStyle } from '../../Tables/DimensionStyle.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { ObjectType } from '../../Types/ObjectType.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadDimensionTemplate extends CadEntityTemplate {
	StyleHandle: number | null = null;

	BlockHandle: number | null = null;

	BlockName: string | null = null;

	StyleName: string | null = null;

	constructor(dimension?: Dimension) {
		super(dimension ?? new DimensionPlaceholder());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const dimension = this.CadObject as Dimension;

		const style = this.getTableReference<DimensionStyle>(builder, this.StyleHandle, this.StyleName ?? '');
		if (style) {
			dimension.style = style;
		}

		const block = this.getTableReference<BlockRecord>(builder, this.BlockHandle, this.BlockName ?? '');
		if (block) {
			dimension.block = block;
		}
	}

	SetDimensionFlags(flags: DimensionType): void {
		const dimension = this.CadObject as Dimension;
		dimension.flags = flags;
	}

	SetDimensionObject(dimension: Dimension): void {
		dimension.handle = this.CadObject.handle;
		dimension.owner = this.CadObject.owner;

		dimension.xDictionary = this.CadObject.xDictionary;

		dimension.color = this.CadObject.color;
		dimension.lineWeight = this.CadObject.lineWeight;
		dimension.lineTypeScale = this.CadObject.lineTypeScale;
		dimension.isInvisible = this.CadObject.isInvisible;
		dimension.transparency = this.CadObject.transparency;

		const source = this.CadObject as Dimension;

		dimension.version = source.version;
		dimension.definitionPoint = source.definitionPoint;
		dimension.textMiddlePoint = source.textMiddlePoint;
		dimension.insertionPoint = source.insertionPoint;
		dimension.normal = source.normal;
		dimension.isTextUserDefinedLocation = source.isTextUserDefinedLocation;
		dimension.attachmentPoint = source.attachmentPoint;
		dimension.lineSpacingStyle = source.lineSpacingStyle;
		dimension.lineSpacingFactor = source.lineSpacingFactor;
		dimension.text = source.text;
		dimension.textRotation = source.textRotation;
		dimension.horizontalDirection = source.horizontalDirection;

		dimension.flags = source.flags;

		if (this.CadObject instanceof DimensionAligned &&
			dimension instanceof DimensionLinear) {
			const aligned = this.CadObject as DimensionAligned;
			const linear = dimension as DimensionLinear;
			linear.firstPoint = aligned.firstPoint;
			linear.secondPoint = aligned.secondPoint;
			linear.extLineRotation = aligned.extLineRotation;
		}

		this.CadObject = dimension;
	}
}

export class DimensionPlaceholder extends Dimension {
	override get objectType(): ObjectType { return ObjectType.INVALID; }

	override get measurement(): number { return 0; }

	getBoundingBox(): any { return null; }

	constructor() {
		super(DimensionType.Linear);
	}
}
