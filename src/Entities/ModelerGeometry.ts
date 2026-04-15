import { Entity } from './Entity.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { BoundingBox } from '../Math/BoundingBox.js';
import { Color } from '../Color.js';
import { XYZ } from '../Math/XYZ.js';

export class ModelerGeometryWire {
	acisIndex: number = 0;
	applyTransformPresent: boolean = false;
	color: Color = Color.ByLayer;
	hasRotation: boolean = false;
	hasShear: boolean = false;
	points: XYZ[] = [];
	scale: number = 0;
	selectionMarker: number = 0;
	translation: XYZ = new XYZ(0, 0, 0);
	type: number = 0;
	xAxis: XYZ = new XYZ(0, 0, 0);
	yAxis: XYZ = new XYZ(0, 0, 0);
	zAxis: XYZ = new XYZ(0, 0, 0);
	/** @internal */
	hasReflection: boolean = false;
}

export class ModelerGeometrySilhouette {
	viewportDirectionFromTarget: XYZ = new XYZ(0, 0, 0);
	viewportId: number = 0;
	viewportPerspective: boolean = false;
	viewportTarget: XYZ = new XYZ(0, 0, 0);
	viewportUpDirection: XYZ = new XYZ(0, 0, 0);
	wires: ModelerGeometryWire[] = [];
}

export abstract class ModelerGeometry extends Entity {
	point: XYZ = new XYZ(0, 0, 0);

	silhouettes: ModelerGeometrySilhouette[] = [];

	override get subclassMarker(): string {
		return DxfSubclassMarker.ModelerGeometry;
	}

	wires: ModelerGeometryWire[] = [];

	/** @internal */
	guid: string = '';

	modelerFormatVersion: number = 0;

	proprietaryData: string = '';

	override applyTransform(transform: unknown): void {
		this.point = this.applyTransformToPoint(transform, this.point);
		for (const wire of this.wires) {
			wire.points = wire.points.map((point) => this.applyTransformToPoint(transform, point));
			wire.translation = this.applyTransformToPoint(transform, wire.translation);
			wire.xAxis = this.applyTransformToVector(transform, wire.xAxis);
			wire.yAxis = this.applyTransformToVector(transform, wire.yAxis);
			wire.zAxis = this.applyTransformToVector(transform, wire.zAxis);
		}
		for (const silhouette of this.silhouettes) {
			silhouette.viewportDirectionFromTarget = this.applyTransformToVector(transform, silhouette.viewportDirectionFromTarget);
			silhouette.viewportTarget = this.applyTransformToPoint(transform, silhouette.viewportTarget);
			silhouette.viewportUpDirection = this.applyTransformToVector(transform, silhouette.viewportUpDirection);
			for (const wire of silhouette.wires) {
				wire.points = wire.points.map((point) => this.applyTransformToPoint(transform, point));
				wire.translation = this.applyTransformToPoint(transform, wire.translation);
				wire.xAxis = this.applyTransformToVector(transform, wire.xAxis);
				wire.yAxis = this.applyTransformToVector(transform, wire.yAxis);
				wire.zAxis = this.applyTransformToVector(transform, wire.zAxis);
			}
		}
	}

	override getBoundingBox(): BoundingBox {
		const points: XYZ[] = [this.point];
		for (const wire of this.wires) {
			points.push(...wire.points);
		}
		for (const silhouette of this.silhouettes) {
			points.push(silhouette.viewportTarget);
			for (const wire of silhouette.wires) {
				points.push(...wire.points);
			}
		}

		return BoundingBox.FromPoints(points);
	}
}
