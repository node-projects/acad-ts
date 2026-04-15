import { Dimension } from './Dimension.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DimensionType } from './DimensionType.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';

export class DimensionOrdinate extends Dimension {
	featureLocation: XYZ = new XYZ(0, 0, 0);

	get isOrdinateTypeX(): boolean {
		return (this._flags & DimensionType.OrdinateTypeX) !== 0;
	}
	set isOrdinateTypeX(value: boolean) {
		if (value) {
			this._flags = this._flags | DimensionType.OrdinateTypeX;
		} else {
			this._flags = this._flags & ~DimensionType.OrdinateTypeX;
		}
	}

	leaderEndpoint: XYZ = new XYZ(0, 0, 0);

	get measurement(): number {
		const dirBase = this.isOrdinateTypeX ? new XY(0, 1) : new XY(1, 0);
		const sin = Math.sin(this.horizontalDirection);
		const cos = Math.cos(this.horizontalDirection);
		const dir = new XY(dirBase.x * cos - dirBase.y * sin, dirBase.x * sin + dirBase.y * cos,);

		const diff = new XY(this.definitionPoint.x - this.featureLocation.x, this.definitionPoint.y - this.featureLocation.y,);

		const t = dir.x * diff.x + dir.y * diff.y;
		const pr = new XY(this.featureLocation.x + t * dir.x, this.featureLocation.y + t * dir.y,);
		const v = new XY(this.definitionPoint.x - pr.x, this.definitionPoint.y - pr.y,);
		const distSqrt = v.x * v.x + v.y * v.y;
		return Math.sqrt(distSqrt);
	}

	override get objectName(): string {
		return DxfFileToken.EntityDimension;
	}

	override get objectType(): ObjectType {
		return ObjectType.DIMENSION_ORDINATE;
	}

	override get subclassMarker(): string {
		return DxfSubclassMarker.OrdinateDimension;
	}

	constructor() {
		super(DimensionType.Ordinate);
	}

	override applyTransform(transform: unknown): void {
		super.applyTransform(transform);
		this.featureLocation = this.applyTransformToPoint(transform, this.featureLocation);
		this.leaderEndpoint = this.applyTransformToPoint(transform, this.leaderEndpoint);
	}

	override getBoundingBox(): BoundingBox {
		return BoundingBox.FromPoints([this.featureLocation, this.leaderEndpoint, this.definitionPoint]);
	}

	override updateBlock(): void {
		this.populateBlock(
			[
				[this.featureLocation, this.definitionPoint],
				[this.definitionPoint, this.leaderEndpoint],
			],
			[this.featureLocation, this.definitionPoint, this.leaderEndpoint],
		);
	}
}
