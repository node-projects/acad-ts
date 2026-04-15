import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { CadDocument } from '../CadDocument.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DimensionStyle } from '../Tables/DimensionStyle.js';
import { LeaderCreationType } from './LeaderCreationType.js';
import { LeaderPathType } from './LeaderPathType.js';
import { HookLineDirection } from './HookLineDirection.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import { XYZ } from '../Math/XYZ.js';

export class Leader extends Entity {
	annotationOffset: XYZ = new XYZ(0, 0, 0);

	arrowHeadEnabled: boolean = false;

	associatedAnnotation: Entity | null = null;

	blockOffset: XYZ = new XYZ(0, 0, 0);

	creationType: LeaderCreationType = LeaderCreationType.CreatedWithoutAnnotation;

	get hasHookline(): boolean {
		if (this.vertices.length <= 1) {
			return false;
		}
		return this.creationType !== LeaderCreationType.CreatedWithoutAnnotation && this.horizontalDirection.getLength() > 0;
	}

	hookLineDirection: HookLineDirection = HookLineDirection.Opposite;

	horizontalDirection: XYZ = new XYZ(1, 0, 0);

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.EntityLeader;
	}

	override get objectType(): ObjectType {
		return ObjectType.LEADER;
	}

	pathType: LeaderPathType = LeaderPathType.StraightLineSegments;

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
		return DxfSubclassMarker.Leader;
	}

	textHeight: number = 0;

	textWidth: number = 0;

	vertices: XYZ[] = [];

	private _style: DimensionStyle = DimensionStyle.Default;

	override applyTransform(transform: unknown): void {
		this.annotationOffset = this.applyTransformToVector(transform, this.annotationOffset);
		this.blockOffset = this.applyTransformToVector(transform, this.blockOffset);
		this.horizontalDirection = this.applyTransformToVector(transform, this.horizontalDirection);
		this.normal = this.transformNormal(transform, this.normal);
		this.vertices = this.vertices.map((vertex) => this.applyTransformToPoint(transform, vertex));
	}

	override clone(): CadObject {
		const clone = super.clone() as Leader;
		clone._style = this._style?.clone() as DimensionStyle;
		return clone;
	}

	override getBoundingBox(): BoundingBox {
		return BoundingBox.FromPoints(this.vertices);
	}

	/** @internal */
	assignDocument(doc: CadDocument): void {
		super.assignDocument(doc);
		this._style = CadObject.updateCollection(this._style, doc.dimensionStyles);
	}

	/** @internal */
	unassignDocument(): void {
		super.unassignDocument();
		this._style = this._style.clone() as DimensionStyle;
	}

	protected override _tableOnRemove(sender: unknown, e: CollectionChangedEventArgs): void {
		super._tableOnRemove(sender, e);
		if (e.item === this._style) {
			this._style = this.document!.dimensionStyles.get(DimensionStyle.DefaultName)!;
		}
	}
}

export { LeaderCreationType } from './LeaderCreationType.js';

export { LeaderPathType } from './LeaderPathType.js';

export { HookLineDirection } from './HookLineDirection.js';
