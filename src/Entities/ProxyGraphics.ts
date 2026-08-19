import { Matrix4 } from '../Math/Matrix4.js';
import { XYZ } from '../Math/XYZ.js';

export enum GraphicsType {
	Unknown = 0, Extents = 1, Circle = 2, CirclePt3 = 3, CircularArc = 4,
	CircularArc3Pt = 5, Polyline = 6, Polygon = 7, Mesh = 8, Shell = 9,
	Text = 10, Text2 = 11, XLine = 12, Ray = 13, SubentColor = 14,
	SubentLayer = 16, SubentLineType = 18, SubentMarker = 19, SubentFillon = 20,
	SubentTrueColor = 22, SubentLineWeight = 23, SubentLineTypeScale = 24,
	SubentThickness = 25, SubentPlotStyleName = 26, PushClip = 27, PopClip = 28,
	PushModelTransform = 29, PushModelTransform2 = 30, PopModelTransform = 31,
	PolylineWithNormal = 32, LwPolyine = 33, SubEntityMaterial = 34,
	SubEntityMapper = 35, UnicodeText = 36, Unknown37 = 37, UnicodeText2 = 38,
}

export interface IProxyGeometry { readonly graphicsType: GraphicsType; }

export class ProxyRawGeometry implements IProxyGeometry {
	constructor(public readonly graphicsType: GraphicsType, public readonly data: Uint8Array) {}
}

export class ProxyExtents implements IProxyGeometry {
	readonly graphicsType = GraphicsType.Extents;
	min = XYZ.zero; max = XYZ.zero;
}

export class ProxyCircle implements IProxyGeometry {
	readonly graphicsType = GraphicsType.Circle;
	center = XYZ.zero; radius = 0; normal = XYZ.axisZ;
}

export class ProxyCirclePt3 implements IProxyGeometry {
	readonly graphicsType = GraphicsType.CirclePt3;
	point1 = XYZ.zero; point2 = XYZ.zero; point3 = XYZ.zero;
}

export class ProxyCircularArc implements IProxyGeometry {
	readonly graphicsType = GraphicsType.CircularArc;
	center = XYZ.zero; radius = 0; normal = XYZ.axisZ; startVectorDirection = XYZ.axisX;
	sweepAngle = 0; arcType = 0;
}

export class ProxyCircularArc3Pt implements IProxyGeometry {
	readonly graphicsType = GraphicsType.CircularArc3Pt;
	point1 = XYZ.zero; point2 = XYZ.zero; point3 = XYZ.zero; arcType = 0;
}

export class ProxyPolyline implements IProxyGeometry {
	readonly graphicsType: GraphicsType = GraphicsType.Polyline;
	points: XYZ[] = [];
}

export class ProxyPolygon extends ProxyPolyline {
	override readonly graphicsType = GraphicsType.Polygon;
}

export class ProxyPolylineWithNormal extends ProxyPolyline {
	override readonly graphicsType = GraphicsType.PolylineWithNormal;
	normal = XYZ.axisZ;
}

export class ProxyMesh implements IProxyGeometry {
	readonly graphicsType = GraphicsType.Mesh;
	rowCount = 0; columnCount = 0; vertices: XYZ[] = [];
	/** Unparsed trait bytes are retained so no proxy data is lost. */
	traitsData: Uint8Array = new Uint8Array();
}

export class ProxyShell implements IProxyGeometry {
	readonly graphicsType = GraphicsType.Shell;
	vertices: XYZ[] = []; faces: number[][] = [];
	traitsData: Uint8Array = new Uint8Array();
}

export class ProxyXLine implements IProxyGeometry {
	readonly graphicsType = GraphicsType.XLine;
	point1 = XYZ.zero; point2 = XYZ.zero;
}

export class ProxyRay implements IProxyGeometry {
	readonly graphicsType = GraphicsType.Ray;
	constructionLinePoint = XYZ.zero; point2 = XYZ.zero;
}

export class ProxyScalarGeometry implements IProxyGeometry {
	constructor(public readonly graphicsType: GraphicsType, public readonly value: number, public readonly secondaryValue?: number) {}
}

export class ProxyModelTransform implements IProxyGeometry {
	constructor(public readonly graphicsType: GraphicsType, public matrix: Matrix4) {}
}
