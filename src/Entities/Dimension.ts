import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { CadDocument } from '../CadDocument.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DimensionStyle } from '../Tables/DimensionStyle.js';
import { BlockRecord } from '../Tables/BlockRecord.js';
import { DimensionType } from './DimensionType.js';
import { AttachmentPointType } from './AttachmentPointType.js';
import { LineSpacingStyleType } from './LineSpacingStyleType.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import { XYZ } from '../Math/XYZ.js';

export abstract class Dimension extends Entity {
	attachmentPoint: AttachmentPointType = AttachmentPointType.TopLeft;

	get block(): BlockRecord | null {
		return this._block;
	}
	set block(value: BlockRecord | null) {
		if (this.document != null) {
			this._block = CadObject.updateCollection(value!, this.document.blockRecords);
		} else {
			this._block = value;
		}
	}

	definitionPoint: XYZ = new XYZ(0, 0, 0);

	get flags(): DimensionType {
		return this._flags;
	}
	/** @internal */
	set flags(value: DimensionType) {
		this._flags = value;
	}

	flipArrow1: boolean = false;

	flipArrow2: boolean = false;

	get hasStyleOverride(): boolean {
		// TODO: ExtendedData access not available
		return false;
	}

	horizontalDirection: number = 0;

	insertionPoint: XYZ = new XYZ(0, 0, 0);

	get isAngular(): boolean {
		return (this._flags & DimensionType.Angular3Point) !== 0 || (this._flags & DimensionType.Angular) !== 0;
	}

	get isTextUserDefinedLocation(): boolean {
		return (this._flags & DimensionType.TextUserDefinedLocation) !== 0;
	}
	set isTextUserDefinedLocation(value: boolean) {
		if (value) {
			this._flags = this._flags | DimensionType.TextUserDefinedLocation;
		} else {
			this._flags = this._flags & ~DimensionType.TextUserDefinedLocation;
		}
	}

	lineSpacingFactor: number = 0;

	lineSpacingStyle: LineSpacingStyleType = LineSpacingStyleType.AtLeast;

	abstract get measurement(): number;

	normal: XYZ = new XYZ(0, 0, 1);

	get style(): DimensionStyle {
		return this._style;
	}
	set style(value: DimensionStyle) {
		if (value == null) {
			throw new Error('value cannot be null');
		}
		if (this.document != null) {
			this._style = CadObject.updateCollection(value, this.document.dimensionStyles);
		} else {
			this._style = value;
		}
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.Dimension;
	}

	text: string = '';

	textMiddlePoint: XYZ = new XYZ(0, 0, 0);

	textRotation: number = 0;

	version: number = 0;

	protected _block: BlockRecord | null = null;
	protected _flags: DimensionType;
	private _style: DimensionStyle = DimensionStyle.Default;

	protected constructor(type: DimensionType) {
		super();
		this._flags = type;
		this._flags |= DimensionType.BlockReference;
	}

	override applyTransform(transform: any): void {
		// TODO: Complex transform with world matrix
	}

	override clone(): CadObject {
		const clone = super.clone() as Dimension;
		clone._style = this._style.clone() as DimensionStyle;
		clone._block = this._block?.clone() as BlockRecord ?? null;
		return clone;
	}

	getActiveDimensionStyle(): DimensionStyle {
		if (!this.hasStyleOverride) {
			return this.style;
		}
		// TODO: Style override map not available
		return this.style;
	}

	getMeasurementText(style?: DimensionStyle): string {
		// TODO: Complex measurement text formatting not available
		return this.measurement.toString();
	}

	getStyleOverrideMap(): any {
		// TODO: DxfClassMap not available
		return null;
	}

	setDimensionOverride(styleOverride: DimensionStyle): void {
		// TODO: DxfClassMap not available
	}

	setStyleOverrideMap(map: any): void {
		// TODO: ExtendedData not available
	}

	updateBlock(): void {
		this.createBlock();
	}

	/** @internal */
	assignDocument(doc: CadDocument): void {
		super.assignDocument(doc);
		this._style = CadObject.updateCollection(this._style, doc.dimensionStyles);
		this._block = CadObject.updateCollection(this._block!, doc.blockRecords);

		if (this._block != null) {
			(this._block as any).name = this.generateBlockName();
		}

		this._block = CadObject.updateCollection(this._block!, doc.blockRecords);
	}

	/** @internal */
	unassignDocument(): void {
		super.unassignDocument();
		this._style = this._style?.clone() as DimensionStyle;
		this._block = this._block?.clone() as BlockRecord ?? null;
	}

	protected createBlock(): void {
		if (this._block == null) {
			this._block = new BlockRecord(this.generateBlockName());
			(this._block as any).isAnonymous = true;
		}

		if (this.document != null) {
			this._block = CadObject.updateCollection(this._block, this.document.blockRecords);
		}

		(this._block as any).entities?.clear?.();
	}

	protected createDefinitionPoint(location: XYZ): any {
		// TODO: Point with Defpoints layer
		return null;
	}

	protected createTextEntity(insertPoint: XYZ, text: string): any {
		// TODO: MText creation
		return null;
	}

	protected override _tableOnRemove(sender: any, e: CollectionChangedEventArgs): void {
		super._tableOnRemove(sender, e);

		if (e.item === this._style) {
			this._style = this.document!.dimensionStyles.get(DimensionStyle.DefaultName)!;
		}

		if (e.item === this._block) {
			this._block = null;
		}
	}

	private generateBlockName(): string {
		return `*D${this.handle}`;
	}
}

export { DimensionType } from './DimensionType.js';
