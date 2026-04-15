import { CadObject } from '../CadObject.js';
import { Color } from '../Color.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { OrthographicType } from '../Types/OrthographicType.js';
import type { VisualStyle } from '../Objects/VisualStyle.js';
import { RenderMode } from '../Types/RenderMode.js';
import { DefaultLightingType } from './DefaultLightingType.js';
import { GridFlags } from './GridFlags.js';
import { TableEntry } from './TableEntry.js';
import { UCS } from './UCS.js';
import { UscIconType } from './UscIconType.js';
import { ViewModeType } from './ViewModeType.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';

function normalizeXYZ(v: XYZ): XYZ {
	const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
	if (len === 0) return new XYZ(0, 0, 0);
	return new XYZ(v.x / len, v.y / len, v.z / len);
}

export class VPort extends TableEntry {
	public static readonly DefaultName: string = '*Active';

	public override get objectType(): ObjectType {
		return ObjectType.VPORT;
	}

	public override get objectName(): string {
		return DxfFileToken.TableVport;
	}

	public override get subclassMarker(): string {
		return DxfSubclassMarker.VPort;
	}

	public static get Default(): VPort {
		return new VPort(VPort.DefaultName);
	}

	public bottomLeft: XY = new XY(0, 0);

	public topRight: XY = new XY(1, 1);

	public center: XY = new XY(0, 0);

	public snapBasePoint: XY = new XY(0, 0);

	public snapSpacing: XY = new XY(0.5, 0.5);

	public gridSpacing: XY = new XY(10, 10);

	public get direction(): XYZ {
		return this._direction;
	}
	public set direction(value: XYZ) {
		this._direction = normalizeXYZ(value);
	}

	public target: XYZ = new XYZ(0, 0, 0);

	public viewHeight: number = 10;

	public aspectRatio: number = 1.0;

	public lensLength: number = 50.0;

	public frontClippingPlane: number = 0.0;

	public backClippingPlane: number = 0;

	public snapRotation: number = 0;

	public twistAngle: number = 0;

	public circleZoomPercent: number = 1000;

	public renderMode: RenderMode = RenderMode.Optimized2D;

	public viewMode: ViewModeType = ViewModeType.FrontClippingZ;

	public ucsIconDisplay: UscIconType = UscIconType.OnOrigin;

	public snapOn: boolean = false;

	public showGrid: boolean = true;

	public isometricSnap: boolean = false;

	public snapIsoPair: number = 0;

	public origin: XYZ = new XYZ(0, 0, 0);

	public xAxis: XYZ = new XYZ(1, 0, 0);

	public yAxis: XYZ = new XYZ(0, 1, 0);

	public namedUcs: UCS | null = null;

	public baseUcs: UCS | null = null;

	public orthographicType: OrthographicType = OrthographicType.None;

	public elevation: number = 0;

	public gridFlags: GridFlags = GridFlags._1 | GridFlags._2;

	public minorGridLinesPerMajorGridLine: number = 5;

	public visualStyle: VisualStyle | null = null;

	public useDefaultLighting: boolean = true;

	public defaultLighting: DefaultLightingType = DefaultLightingType.TwoDistantLights;

	public brightness: number = 0;

	public contrast: number = 0;

	public ambientColor: Color = new Color(0);

	private _direction: XYZ = new XYZ(0, 0, 1);

	public constructor(name?: string) {
		super(name);
	}

	public override clone(): CadObject {
		const clone = super.clone() as VPort;
		clone.baseUcs = this.baseUcs ? this.baseUcs.clone() as UCS : null;
		clone.namedUcs = this.namedUcs ? this.namedUcs.clone() as UCS : null;
		return clone;
	}
}

export { DefaultLightingType } from './DefaultLightingType.js';

export { GridFlags } from './GridFlags.js';

export { UscIconType } from './UscIconType.js';
