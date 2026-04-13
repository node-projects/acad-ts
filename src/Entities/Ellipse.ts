import { Entity } from './Entity.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { XYZ } from '../Math/XYZ.js';

export class Ellipse extends Entity {
	center: XYZ = new XYZ(0, 0, 0);

	endParameter: number = Math.PI * 2;

	get isFullEllipse(): boolean {
		return this.startParameter === 0 && this.endParameter === Math.PI * 2;
	}

	get majorAxis(): number {
		return 2 * Math.sqrt(
			this.majorAxisEndPoint.x ** 2 +
			this.majorAxisEndPoint.y ** 2 +
			this.majorAxisEndPoint.z ** 2
		);
	}

	majorAxisEndPoint: XYZ = new XYZ(1, 0, 0);

	get minorAxis(): number {
		return this.majorAxis * this.radiusRatio;
	}

	get minorAxisEndpoint(): XYZ {
		const len = Math.sqrt(
			this.majorAxisEndPoint.x ** 2 +
			this.majorAxisEndPoint.y ** 2 +
			this.majorAxisEndPoint.z ** 2
		);
		if (len === 0) return new XYZ(0, 0, 0);
		const nx = this.majorAxisEndPoint.x / len;
		const ny = this.majorAxisEndPoint.y / len;
		const nz = this.majorAxisEndPoint.z / len;
		// Cross product of Normal and normalized MajorAxisEndPoint
		const dx = this.normal.y * nz - this.normal.z * ny;
		const dy = this.normal.z * nx - this.normal.x * nz;
		const dz = this.normal.x * ny - this.normal.y * nx;
		const dLen = Math.sqrt(dx * dx + dy * dy + dz * dz);
		if (dLen === 0) return new XYZ(0, 0, 0);
		const scale = this.radiusRatio * len;
		return new XYZ((dx / dLen) * scale, (dy / dLen) * scale, (dz / dLen) * scale,);
	}

	normal: XYZ = new XYZ(0, 0, 1);

	override get objectName(): string {
		return DxfFileToken.EntityEllipse;
	}

	override get objectType(): ObjectType {
		return ObjectType.ELLIPSE;
	}

	get radiusRatio(): number {
		return this._radiusRatio;
	}
	set radiusRatio(value: number) {
		if (value <= 0 || value > 1) {
			throw new Error('Radius ratio must be a value between 0 (not included) and 1.');
		}
		this._radiusRatio = value;
	}

	get rotation(): number {
		return Math.atan2(this.majorAxisEndPoint.y, this.majorAxisEndPoint.x);
	}

	startParameter: number = 0.0;

	override get subclassMarker(): string {
		return DxfSubclassMarker.Ellipse;
	}

	thickness: number = 0.0;

	private _radiusRatio: number = 1.0;

	override applyTransform(transform: any): void {
		// TODO: Transform operations not available
	}

	override getBoundingBox(): any {
		// TODO: PolygonalVertexes and BoundingBox.FromPoints not available
		return null;
	}

	getEndVertices(): { start: XYZ; end: XYZ } {
		const start = this.polarCoordinateRelativeToCenter(this.startParameter);
		const end = this.polarCoordinateRelativeToCenter(this.endParameter);
		return { start, end };
	}

	polarCoordinateRelativeToCenter(angle: number): XYZ {
		// TODO: CurveExtensions.PolarCoordinate not available
		return new XYZ(0, 0, 0);
	}

	polygonalVertexes(precision: number): XYZ[] {
		// TODO: CurveExtensions.PolygonalVertexes not available
		return [];
	}
}
