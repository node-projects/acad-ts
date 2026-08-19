import { Color } from '../Color.js';
import { Arc } from '../Entities/Arc.js';
import { Circle } from '../Entities/Circle.js';
import { Entity } from '../Entities/Entity.js';
import { Line } from '../Entities/Line.js';
import { LwPolyline, LwPolylineVertex } from '../Entities/LwPolyline.js';
import { Solid } from '../Entities/Solid.js';
import { XY } from '../Math/XY.js';
import { XYZ } from '../Math/XYZ.js';
import { BlockRecord } from '../Tables/BlockRecord.js';
import { Layer } from '../Tables/Layer.js';
import { LineType } from '../Tables/LineType.js';
import { LineWeightType } from '../Types/LineWeightType.js';

/** Factory for AutoCAD's predefined dimension-arrowhead blocks. */
export class DimensionArrowhead {
	static readonly architecturalTickName = '_ArchTick';
	static readonly boxBlankName = '_BoxBlank';
	static readonly boxFilledName = '_BoxFilled';
	static readonly closedBlankName = '_ClosedBlank';
	static readonly closedName = '_Closed';
	static readonly datumBlankName = '_DatumBlank';
	static readonly datumFilledName = '_DatumFilled';
	static readonly dotBlankName = '_DotBlank';
	static readonly dotName = '_Dot';
	static readonly dotSmallBlankName = '_DotSmallBlank';
	static readonly dotSmallName = '_DotSmall';
	static readonly integralName = '_Integral';
	static readonly noneName = '_None';
	static readonly obliqueName = '_Oblique';
	static readonly open30Name = '_Open30';
	static readonly open90Name = '_Open90';
	static readonly openName = '_Open';
	static readonly originIndicator2Name = '_Origin2';
	static readonly originIndicatorName = '_Origin';

	static get architecturalTick(): BlockRecord {
		const vertices = [new LwPolylineVertex(new XY(-0.5, -0.5)), new LwPolylineVertex(new XY(0.5, 0.5))];
		const polyline = this._defaults(new LwPolyline(vertices));
		polyline.isClosed = true;
		polyline.constantWidth = 0.15;
		return this._block(this.architecturalTickName, polyline);
	}

	static get boxBlank(): BlockRecord {
		return this._block(this.boxBlankName,
			this._line(-0.5, -0.5, 0.5, -0.5), this._line(0.5, -0.5, 0.5, 0.5),
			this._line(0.5, 0.5, -0.5, 0.5), this._line(-0.5, 0.5, -0.5, -0.5),
			this._line(-0.5, 0, -1, 0));
	}

	static get boxFilled(): BlockRecord {
		return this._block(this.boxFilledName,
			this._defaults(new Solid(new XYZ(-0.5, 0.5), new XYZ(0.5, 0.5), new XYZ(-0.5, -0.5), new XYZ(0.5, -0.5))),
			this._line(-0.5, 0, -1, 0));
	}

	static get closed(): BlockRecord {
		return this._block(this.closedName,
			this._line(-1, 1 / 6, 0, 0), this._line(0, 0, -1, -1 / 6),
			this._line(-1, 1 / 6, -1, -1 / 6), this._line(0, 0, -1, 0));
	}

	static get closedBlank(): BlockRecord {
		return this._block(this.closedBlankName,
			this._line(-1, 1 / 6, 0, 0), this._line(0, 0, -1, -1 / 6), this._line(-1, 1 / 6, -1, -1 / 6));
	}

	static get datumFilled(): BlockRecord {
		return this._block(this.datumFilledName,
			this._defaults(new Solid(new XYZ(0, 0.57735027), new XYZ(-1, 0), new XYZ(0, -0.57735027))));
	}

	static get datumTriangle(): BlockRecord {
		const height = 1 / Math.sqrt(3);
		return this._block(this.datumBlankName,
			this._line(0, height, -1, 0), this._line(-1, 0, 0, -height), this._line(0, -height, 0, height));
	}

	static get dot(): BlockRecord {
		const vertices = [new LwPolylineVertex(new XY(-0.25, 0)), new LwPolylineVertex(new XY(0.25, 0))];
		vertices[0].bulge = vertices[1].bulge = 1;
		const polyline = this._defaults(new LwPolyline(vertices));
		polyline.isClosed = true;
		polyline.constantWidth = 0.5;
		return this._block(this.dotName, polyline, this._line(-0.5, 0, -1, 0));
	}

	static get dotBlank(): BlockRecord {
		return this._block(this.dotBlankName, this._defaults(new Circle(XYZ.zero, 0.5)), this._line(-0.5, 0, -1, 0));
	}

	static get dotSmall(): BlockRecord {
		const vertices = [new LwPolylineVertex(new XY(-0.0625, 0)), new LwPolylineVertex(new XY(0.0625, 0))];
		vertices[0].bulge = vertices[1].bulge = 1;
		const polyline = this._defaults(new LwPolyline(vertices));
		polyline.isClosed = true;
		polyline.constantWidth = 0.5;
		return this._block(this.dotSmallName, polyline);
	}

	static get dotSmallBlank(): BlockRecord {
		return this._block(this.dotSmallBlankName, this._defaults(new Circle(XYZ.zero, 0.25)));
	}

	static get integral(): BlockRecord {
		return this._block(this.integralName,
			this._defaults(new Arc(new XYZ(0.44488802, -0.09133463), 0.45416667, 1.78024, 2.93215)),
			this._defaults(new Arc(new XYZ(-0.44488802, 0.09133463), 0.45416667, 4.92182849098779, 6.073745796984934)));
	}

	static get none(): BlockRecord { return new BlockRecord(this.noneName); }
	static get oblique(): BlockRecord { return this._block(this.obliqueName, this._line(-0.5, -0.5, 0.5, 0.5)); }

	static get open(): BlockRecord {
		return this._block(this.openName,
			this._line(-1, 1 / 6, 0, 0), this._line(0, 0, -1, -1 / 6), this._line(0, 0, -1, 0));
	}

	static get open30(): BlockRecord {
		const offset = 2 - Math.sqrt(3);
		return this._block(this.open30Name,
			this._line(-1, offset, 0, 0), this._line(0, 0, -1, -offset), this._line(0, 0, -1, 0));
	}

	static get open90(): BlockRecord {
		return this._block(this.open90Name,
			this._line(-0.5, 0.5, 0, 0), this._line(0, 0, -0.5, -0.5), this._line(0, 0, -1, 0));
	}

	static get originIndicator(): BlockRecord {
		return this._block(this.originIndicatorName, this._defaults(new Circle(XYZ.zero, 0.5)), this._line(0, 0, -1, 0));
	}

	static get originIndicator2(): BlockRecord {
		return this._block(this.originIndicator2Name,
			this._defaults(new Circle(XYZ.zero, 0.5)), this._defaults(new Circle(XYZ.zero, 0.25)), this._line(-0.5, 0, -1, 0));
	}

	private static _block(name: string, ...entities: Entity[]): BlockRecord {
		const block = new BlockRecord(name);
		for (const entity of entities) block.entities.add(entity);
		return block;
	}

	private static _line(x1: number, y1: number, x2: number, y2: number): Line {
		return this._defaults(new Line(new XYZ(x1, y1, 0), new XYZ(x2, y2, 0)));
	}

	private static _defaults<T extends Entity>(entity: T): T {
		entity.layer = Layer.default;
		entity.lineType = LineType.byBlock;
		entity.color = Color.byBlock;
		entity.lineWeight = LineWeightType.ByBlock;
		return entity;
	}
}
