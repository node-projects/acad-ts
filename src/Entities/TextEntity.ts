import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { CadDocument } from '../CadDocument.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { TextStyle } from '../Tables/TextStyle.js';
import { TextHorizontalAlignment } from './TextHorizontalAlignment.js';
import { TextVerticalAlignmentType } from './TextVerticalAlignmentType.js';
import { TextMirrorFlag } from './TextMirrorFlag.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import { IText } from './IText.js';
import { XYZ } from '../Math/XYZ.js';

export class TextEntity extends Entity implements IText {
	alignmentPoint: XYZ = new XYZ(0, 0, 0);

	get height(): number {
		return this._height;
	}
	set height(value: number) {
		if (value <= 0) {
			throw new Error('The Text height must be greater than zero.');
		}
		this._height = value;
	}

	horizontalAlignment: TextHorizontalAlignment = TextHorizontalAlignment.Left;

	insertPoint: XYZ = new XYZ(0, 0, 0);

	get mirror(): TextMirrorFlag {
		return this._mirror;
	}
	set mirror(value: TextMirrorFlag) {
		this._mirror = value;
	}

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.EntityText;
	}

	override get objectType(): ObjectType {
		return ObjectType.TEXT;
	}

	obliqueAngle: number = 0.0;

	rotation: number = 0;

	get style(): TextStyle {
		return this._style;
	}
	set style(value: TextStyle) {
		if (value == null) {
			throw new Error('value cannot be null');
		}
		if (this.document != null) {
			this._style = CadObject.updateCollection(value, this.document.textStyles);
		} else {
			this._style = value;
		}
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.Text;
	}

	thickness: number = 0.0;

	get value(): string {
		return this._value;
	}
	set value(v: string) {
		if (v.length > 256) {
			throw new Error(`Text length cannot be superior to 256, current: ${v.length}`);
		}
		this._value = v;
	}

	verticalAlignment: TextVerticalAlignmentType = TextVerticalAlignmentType.Baseline;

	widthFactor: number = 1.0;

	private _height: number = 1.0;
	private _mirror: TextMirrorFlag = TextMirrorFlag.None;
	private _style: TextStyle = TextStyle.Default;
	private _value: string = '';

	constructor() {
		super();
	}

	override applyTransform(transform: any): void {
		// TODO: Complex transform logic not available (Matrix3, XY operations)
	}

	override clone(): CadObject {
		const clone = super.clone() as TextEntity;
		clone._style = this._style.clone() as TextStyle;
		return clone;
	}

	override getBoundingBox(): any {
		return null;
	}

	/** @internal */
	assignDocument(doc: CadDocument): void {
		super.assignDocument(doc);
		this._style = CadObject.updateCollection(this._style, doc.textStyles);
	}

	/** @internal */
	unassignDocument(): void {
		super.unassignDocument();
		this._style = this._style.clone() as TextStyle;
	}

	protected override _tableOnRemove(sender: any, e: CollectionChangedEventArgs): void {
		super._tableOnRemove(sender, e);
		if (e.item === this._style) {
			this._style = this.document!.textStyles.get(TextStyle.DefaultName)!;
		}
	}
}

export { TextHorizontalAlignment } from './TextHorizontalAlignment.js';

export { TextVerticalAlignmentType } from './TextVerticalAlignmentType.js';

export { TextMirrorFlag } from './TextMirrorFlag.js';
