import { Entity } from './Entity.js';
import { CadObject } from '../CadObject.js';
import { CadDocument } from '../CadDocument.js';
import { Color } from '../Color.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { ViewportStatusFlags } from './ViewportStatusFlags.js';
import { LightingType } from './LightingType.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { Layer } from '../Tables/Layer.js';
import { CollectionChangedEventArgs } from '../CollectionChangedEventArgs.js';
import type { Scale } from '../Objects/Scale.js';
import type { VisualStyle } from '../Objects/VisualStyle.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';

export class Viewport extends Entity {
	ambientLightColor: Color | null = null;

	backClipPlane: number = 0;

	boundary: Entity | null = null;

	brightness: number = 0;

	center: XYZ = new XYZ(0, 0, 0);

	circleZoomPercent: number = 0;

	contrast: number = 0;

	defaultLightingType: LightingType = LightingType.OneDistantLight;

	displayUcsIcon: boolean = false;

	elevation: number = 0;

	frontClipPlane: number = 0;

	frozenLayers: Layer[] = [];

	gridSpacing: XY = new XY(0, 0);

	height: number = 0;

	get id(): number {
		if (this._id !== 0) {
			return this._id;
		}

		const entities = (this.owner as { entities?: Iterable<Entity> } | null)?.entities;
		if (entities == null) {
			return 0;
		}

		let viewportIndex = 0;
		for (const entity of entities) {
			if (entity instanceof Viewport) {
				viewportIndex++;
				if (entity === this) {
					return viewportIndex;
				}
			}
		}

		return 0;
	}
	set id(value: number) {
		this._id = value;
	}

	lensLength: number = 0;

	majorGridLineFrequency: number = 0;

	override get objectName(): string {
		return DxfFileToken.entityViewport;
	}

	override get objectType(): ObjectType {
		return ObjectType.VIEWPORT;
	}

	renderMode: number = 0;

	get representsPaper(): boolean {
		return this.id === Viewport.paperViewId;
	}

	scale: Scale | null = null;

	get scaleFactor(): number {
		if (this.height === 0) return 1;
		return 1 / (this.viewHeight / this.height);
	}

	shadePlotMode: number = 0;

	snapAngle: number = 0;

	snapBase: XY = new XY(0, 0);

	snapSpacing: XY = new XY(0, 0);

	status: ViewportStatusFlags = 0 as ViewportStatusFlags;

	styleSheetName: string = '';

	override get subclassMarker(): string {
		return DxfSubclassMarker.viewport;
	}

	twistAngle: number = 0;

	ucsOrigin: XYZ = new XYZ(0, 0, 0);

	ucsOrthographicType: number = 0;

	ucsPerViewport: boolean = false;

	ucsXAxis: XYZ = new XYZ(1, 0, 0);

	ucsYAxis: XYZ = new XYZ(0, 1, 0);

	useDefaultLighting: boolean = false;

	viewCenter: XY = new XY(0, 0);

	viewDirection: XYZ = new XYZ(0, 0, 1);

	viewHeight: number = 0;

	viewTarget: XYZ = new XYZ(0, 0, 0);

	get viewWidth(): number {
		if (this.height === 0) return 0;
		return this.viewHeight / this.height * this.width;
	}

	visualStyle: VisualStyle | null = null;

	width: number = 0;

	static readonly asdk_xrec_annotation_scale_info = 'ASDK_XREC_ANNOTATION_SCALE_INFO';

	static readonly paperViewId = 1;

	override applyTransform(transform: unknown): void {
		if (this.boundary != null) {
			this.boundary.applyTransform(transform);
			const bounds = this.boundary.getBoundingBox();
			if (bounds != null) {
				this.center = bounds.center;
				this.width = bounds.width;
				this.height = bounds.height;
			}
		} else {
			const bounds = this.getBoundingBox();
			const corners = [
				new XYZ(bounds.min.x, bounds.min.y, bounds.min.z),
				new XYZ(bounds.min.x, bounds.max.y, bounds.min.z),
				new XYZ(bounds.max.x, bounds.min.y, bounds.min.z),
				new XYZ(bounds.max.x, bounds.max.y, bounds.min.z),
			].map((corner) => this.applyTransformToPoint(transform, corner));
			const transformedBounds = BoundingBox.fromPoints(corners);
			this.center = transformedBounds.center;
			this.width = transformedBounds.width;
			this.height = transformedBounds.height;
		}

		this.viewTarget = this.applyTransformToPoint(transform, this.viewTarget);
		this.viewDirection = this.applyTransformToVector(transform, this.viewDirection);
		this.ucsOrigin = this.applyTransformToPoint(transform, this.ucsOrigin);
		this.ucsXAxis = this.applyTransformToVector(transform, this.ucsXAxis);
		this.ucsYAxis = this.applyTransformToVector(transform, this.ucsYAxis);
	}

	override clone(): CadObject {
		const clone = super.clone() as Viewport;
		clone.boundary = this.boundary?.clone() as Entity ?? null;
		clone.visualStyle = this.visualStyle?.clone() as VisualStyle | null ?? null;
		clone.scale = this.scale?.clone() as Scale | null ?? null;
		clone.frozenLayers = this.frozenLayers.map(l => l.clone() as Layer);
		return clone;
	}

	override getBoundingBox(): BoundingBox {
		return new BoundingBox(
			new XYZ(this.center.x - this.width / 2, this.center.y - this.height / 2, this.center.z,),
			new XYZ(this.center.x + this.width / 2, this.center.y + this.height / 2, this.center.z,),
		);
	}

	getModelBoundingBox(): BoundingBox {
		return new BoundingBox(
			new XYZ(this.viewCenter.x - this.viewWidth / 2, this.viewCenter.y - this.viewHeight / 2, 0,),
			new XYZ(this.viewCenter.x + this.viewWidth / 2, this.viewCenter.y + this.viewHeight / 2, 0,),
		);
	}

	selectEntities(includePartial: boolean = true): Entity[] {
		if (this.document == null) {
			throw new Error('Viewport needs to be assigned to a document.');
		}

		const viewBounds = this.getModelBoundingBox();
		const overlaps = (candidate: BoundingBox): boolean =>
			candidate.max.x >= viewBounds.min.x &&
			candidate.min.x <= viewBounds.max.x &&
			candidate.max.y >= viewBounds.min.y &&
			candidate.min.y <= viewBounds.max.y;
		const contains = (candidate: BoundingBox): boolean =>
			candidate.min.x >= viewBounds.min.x &&
			candidate.max.x <= viewBounds.max.x &&
			candidate.min.y >= viewBounds.min.y &&
			candidate.max.y <= viewBounds.max.y;

		const selected: Entity[] = [];
		for (const entity of this.document.entities ?? []) {
			if (entity === this) {
				continue;
			}

			const bounds = entity.getBoundingBox();
			if (bounds == null) {
				continue;
			}

			if (includePartial ? overlaps(bounds) : contains(bounds)) {
				selected.push(entity);
			}
		}

		return selected;
	}

	/** @internal */
	assignDocument(doc: CadDocument): void {
		super.assignDocument(doc);
	}

	/** @internal */
	unassignDocument(): void {
		super.unassignDocument();
		this.scale = this.scale?.clone() as Scale | null ?? null;
	}

	private _id: number = 0;
}

export { ViewportStatusFlags } from './ViewportStatusFlags.js';
