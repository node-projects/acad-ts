import { NonGraphicalObject } from './NonGraphicalObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { DesignCoordinatesType } from './DesignCoordinatesType.js';
import { GeoDataVersion } from './GeoDataVersion.js';
import { ScaleEstimationType } from './ScaleEstimationType.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';
import { BlockRecord } from '../Tables/BlockRecord.js';

export class GeoMeshFace {
	index1: number = 0;
	index2: number = 0;
	index3: number = 0;
}

export class GeoMeshPoint {
	source: XY = new XY(0, 0);
	destination: XY = new XY(0, 0);

	toString(): string {
		return `src:${this.source.x},${this.source.y} dest:${this.destination.x},${this.destination.y}`;
	}
}

export class GeoData extends NonGraphicalObject {
	override get objectType(): ObjectType { return ObjectType.UNLISTED; }
	override get objectName(): string { return DxfFileToken.ObjectGeoData; }
	override get subclassMarker(): string { return DxfSubclassMarker.GeoData; }

	version: GeoDataVersion = GeoDataVersion.R2013;
	coordinatesType: DesignCoordinatesType = DesignCoordinatesType.LocalGrid;
	hostBlock: BlockRecord | null = null;
	designPoint: XYZ = new XYZ(0, 0, 0);
	referencePoint: XYZ = new XYZ(0, 0, 0);
	northDirection: XY = new XY(0, 1);
	horizontalUnitScale: number = 1;
	verticalUnitScale: number = 1;
	horizontalUnits: number = 0;
	verticalUnits: number = 0;
	upDirection: XYZ = new XYZ(0, 0, 1);
	scaleEstimationMethod: ScaleEstimationType = ScaleEstimationType.None;
	enableSeaLevelCorrection: boolean = false;
	userSpecifiedScaleFactor: number = 0;
	seaLevelElevation: number = 0;
	coordinateProjectionRadius: number = 0;
	coordinateSystemDefinition: string = '';
	geoRssTag: string = '';
	observationFromTag: string = '';
	observationToTag: string = '';
	observationCoverageTag: string = '';
	points: GeoMeshPoint[] = [];
	faces: GeoMeshFace[] = [];
}

export { GeoDataVersion } from './GeoDataVersion.js';

export { DesignCoordinatesType } from './DesignCoordinatesType.js';

export { ScaleEstimationType } from './ScaleEstimationType.js';
