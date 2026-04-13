import { Entity } from './Entity.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
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

	override applyTransform(transform: any): void {
		// No-op in C# source
	}

	override getBoundingBox(): any {
		// BoundingBox.Null
		return null;
	}
}
