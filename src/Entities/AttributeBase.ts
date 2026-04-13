import { TextEntity } from './TextEntity.js';
import { AttributeType } from './AttributeType.js';
import { AttributeFlags } from './AttributeFlags.js';
import { TextVerticalAlignmentType } from './TextVerticalAlignmentType.js';
import { IEntity } from './IEntity.js';

export abstract class AttributeBase extends TextEntity {
	attributeType: AttributeType = AttributeType.SingleLine;

	flags: AttributeFlags = AttributeFlags.None;

	isReallyLocked: boolean = false;

	mText: any /* MText */ = null;

	get tag(): string {
		return this._tag;
	}
	set tag(value: string) {
		this._tag = value;
	}

	version: number = 0;

	override verticalAlignment: TextVerticalAlignmentType = TextVerticalAlignmentType.Baseline;

	private _tag: string = '';

	constructor() {
		super();
	}

	protected matchAttributeProperties(src: AttributeBase): void {
		this.matchProperties(src as unknown as IEntity);

		this.thickness = src.thickness;
		this.insertPoint = src.insertPoint;
		this.height = src.height;
		this.value = src.value;
		this.rotation = src.rotation;
		this.widthFactor = src.widthFactor;
		this.obliqueAngle = src.obliqueAngle;

		if ((this.style as any).document !== (src.style as any).document) {
			this.style = src.style.clone() as any;
		} else {
			this.style = src.style;
		}

		this.mirror = src.mirror;
		this.horizontalAlignment = src.horizontalAlignment;
		this.alignmentPoint = src.alignmentPoint;
		this.normal = src.normal;
		this.verticalAlignment = src.verticalAlignment;

		this.version = src.version;
		this.tag = src.tag;
		this.flags = src.flags;
		this.attributeType = src.attributeType;
		this.isReallyLocked = src.isReallyLocked;

		this.insertPoint = src.insertPoint;
	}
}

export { AttributeType } from './AttributeType.js';

export { AttributeFlags } from './AttributeFlags.js';
