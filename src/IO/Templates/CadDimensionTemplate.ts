import { Dimension, DimensionType } from '../../Entities/Dimension.js';
import { DimensionAligned } from '../../Entities/DimensionAligned.js';
import { DimensionLinear } from '../../Entities/DimensionLinear.js';
import { DimensionStyle } from '../../Tables/DimensionStyle.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { ObjectType } from '../../Types/ObjectType.js';
import { BoundingBox } from '../../Math/BoundingBox.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';

export class CadDimensionTemplate extends CadEntityTemplate {
	styleHandle: number | null = null;

	blockHandle: number | null = null;

	blockName: string | null = null;

	styleName: string | null = null;

	constructor(dimension?: Dimension) {
		super(dimension ?? new DimensionPlaceholder());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const dimension = this.cadObject as Dimension;

		const style = this.getTableReference<DimensionStyle>(builder, this.styleHandle, this.styleName ?? '');
		if (style) {
			dimension.style = style;
		}

		const block = this.getTableReference<BlockRecord>(builder, this.blockHandle, this.blockName ?? '');
		if (block) {
			dimension.block = block;
		}
	}

	setDimensionFlags(flags: DimensionType): void {
		const dimension = this.cadObject as Dimension;
		dimension.flags = flags;
	}

	setDimensionObject(dimension: Dimension): void {
		dimension.handle = this.cadObject.handle;
		dimension.owner = this.cadObject.owner;

		dimension.xDictionary = this.cadObject.xDictionary;

		dimension.color = this.cadObject.color;
		dimension.lineWeight = this.cadObject.lineWeight;
		dimension.lineTypeScale = this.cadObject.lineTypeScale;
		dimension.isInvisible = this.cadObject.isInvisible;
		dimension.transparency = this.cadObject.transparency;

		const source = this.cadObject as Dimension;

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

		if (this.cadObject instanceof DimensionAligned &&
			dimension instanceof DimensionLinear) {
			const aligned = this.cadObject as DimensionAligned;
			const linear = dimension as DimensionLinear;
			linear.firstPoint = aligned.firstPoint;
			linear.secondPoint = aligned.secondPoint;
			linear.extLineRotation = aligned.extLineRotation;
		}

		this.cadObject = dimension;
	}
}

export class DimensionPlaceholder extends Dimension {
	override get objectType(): ObjectType { return ObjectType.INVALID; }

	override get measurement(): number { return 0; }

	getBoundingBox(): BoundingBox | null { return null; }

	constructor() {
		super(DimensionType.Linear);
	}
}
