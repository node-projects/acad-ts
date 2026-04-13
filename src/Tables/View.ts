import { CadObject } from '../CadObject.js';
import { DxfFileToken } from '../DxfFileToken.js';
import { DxfSubclassMarker } from '../DxfSubclassMarker.js';
import { ObjectType } from '../Types/ObjectType.js';
import { OrthographicType } from '../Types/OrthographicType.js';
import { RenderMode } from '../Types/RenderMode.js';
import { TableEntry } from './TableEntry.js';
import { ViewModeType } from './ViewModeType.js';
import { XYZ } from '../Math/XYZ.js';
import { XY } from '../Math/XY.js';

export class View extends TableEntry {
	public override get objectType(): ObjectType {
		return ObjectType.VIEW;
	}

	public override get objectName(): string {
		return DxfFileToken.TableView;
	}

	public override get subclassMarker(): string {
		return DxfSubclassMarker.View;
	}

	public height: number = 0;

	public width: number = 0;

	public lensLength: number = 0;

	public frontClipping: number = 0;

	public backClipping: number = 0;

	public angle: number = 0;

	public viewMode: ViewModeType = ViewModeType.Off;

	public isUcsAssociated: boolean = false;

	public isPlottable: boolean = false;

	public renderMode: RenderMode = RenderMode.Optimized2D;

	public center: XY = new XY(0, 0);

	public direction: XYZ = new XYZ(0, 0, 0);

	public target: XYZ = new XYZ(0, 0, 0);

	public visualStyle: any /* VisualStyle */ = null;

	public ucsOrigin: XYZ = new XYZ(0, 0, 0);

	public ucsXAxis: XYZ = new XYZ(0, 0, 0);

	public ucsYAxis: XYZ = new XYZ(0, 0, 0);

	public ucsElevation: number = 0;

	public ucsOrthographicType: OrthographicType = OrthographicType.None;

	public constructor(name?: string) {
		super(name);
	}

	public override clone(): CadObject {
		const clone = super.clone() as View;
		clone.visualStyle = this.visualStyle?.clone?.() ?? null;
		return clone;
	}
}

export { ViewModeType } from './ViewModeType.js';

export { RenderMode } from '../Types/RenderMode.js';
