import {
	GraphicsType, IProxyGeometry, ProxyCircle, ProxyCirclePt3, ProxyCircularArc,
	ProxyCircularArc3Pt, ProxyExtents, ProxyMesh, ProxyModelTransform, ProxyPolygon,
	ProxyPolyline, ProxyPolylineWithNormal, ProxyRawGeometry, ProxyRay,
	ProxyScalarGeometry, ProxyShell, ProxyXLine,
} from '../Entities/ProxyGraphics.js';
import { Matrix4 } from '../Math/Matrix4.js';
import { XYZ } from '../Math/XYZ.js';

class LittleEndianReader {
	position = 0;
	readonly view: DataView;
	constructor(readonly data: Uint8Array) {
		this.view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	}
	get remaining(): number { return this.data.length - this.position; }
	int32(): number { const value = this.view.getInt32(this.position, true); this.position += 4; return value; }
	uint32(): number { const value = this.view.getUint32(this.position, true); this.position += 4; return value; }
	double(): number { const value = this.view.getFloat64(this.position, true); this.position += 8; return value; }
	point(): XYZ { return new XYZ(this.double(), this.double(), this.double()); }
	bytes(count: number): Uint8Array { const value = this.data.slice(this.position, this.position + count); this.position += count; return value; }
}

export class ProxyGeometryReader {
	static readGeometries(data: Uint8Array): IProxyGeometry[] {
		if (data.length < 8) return [];
		const reader = new LittleEndianReader(data);
		reader.int32(); // total byte size
		const count = reader.int32();
		const geometries: IProxyGeometry[] = [];

		for (let index = 0; index < count && reader.remaining >= 8; index++) {
			const objectStart = reader.position;
			const objectSize = reader.int32();
			const type = reader.int32() as GraphicsType;
			if (objectSize < 8 || objectStart + objectSize > data.length) break;
			const payload = reader.bytes(objectSize - 8);
			try {
				geometries.push(this.readGeometry(type, payload));
			} catch {
				geometries.push(new ProxyRawGeometry(type, payload));
			}
		}
		return geometries;
	}

	private static readGeometry(type: GraphicsType, payload: Uint8Array): IProxyGeometry {
		const reader = new LittleEndianReader(payload);
		switch (type) {
			case GraphicsType.Extents: {
				const item = new ProxyExtents(); item.min = reader.point(); item.max = reader.point(); return item;
			}
			case GraphicsType.Circle: {
				const item = new ProxyCircle(); item.center = reader.point(); item.radius = reader.double(); item.normal = reader.point(); return item;
			}
			case GraphicsType.CirclePt3: {
				const item = new ProxyCirclePt3(); item.point1 = reader.point(); item.point2 = reader.point(); item.point3 = reader.point(); return item;
			}
			case GraphicsType.CircularArc: {
				const item = new ProxyCircularArc(); item.center = reader.point(); item.radius = reader.double(); item.normal = reader.point();
				item.startVectorDirection = reader.point(); item.sweepAngle = reader.double(); item.arcType = reader.int32(); return item;
			}
			case GraphicsType.CircularArc3Pt: {
				const item = new ProxyCircularArc3Pt(); item.point1 = reader.point(); item.point2 = reader.point(); item.point3 = reader.point(); item.arcType = reader.int32(); return item;
			}
			case GraphicsType.Polyline: return this.readPolyline(reader, new ProxyPolyline());
			case GraphicsType.Polygon: return this.readPolyline(reader, new ProxyPolygon());
			case GraphicsType.PolylineWithNormal: {
				const item = this.readPolyline(reader, new ProxyPolylineWithNormal()) as ProxyPolylineWithNormal;
				if (reader.remaining >= 24) item.normal = reader.point();
				return item;
			}
			case GraphicsType.Mesh: {
				const item = new ProxyMesh(); item.rowCount = reader.int32(); item.columnCount = reader.int32();
				const count = item.rowCount * item.columnCount;
				for (let i = 0; i < count; i++) item.vertices.push(reader.point());
				item.traitsData = reader.bytes(reader.remaining); return item;
			}
			case GraphicsType.Shell: {
				const item = new ProxyShell(); const vertexCount = reader.int32();
				for (let i = 0; i < vertexCount; i++) item.vertices.push(reader.point());
				const faceListSize = reader.int32(); const faceEnd = reader.position + faceListSize * 4;
				while (reader.position < faceEnd && reader.remaining >= 4) {
					const faceCount = Math.abs(reader.int32()); const face: number[] = [];
					for (let i = 0; i < faceCount && reader.remaining >= 4; i++) face.push(reader.int32());
					item.faces.push(face);
				}
				item.traitsData = reader.bytes(reader.remaining); return item;
			}
			case GraphicsType.XLine: {
				const item = new ProxyXLine(); item.point1 = reader.point(); item.point2 = reader.point(); return item;
			}
			case GraphicsType.Ray: {
				const item = new ProxyRay(); item.constructionLinePoint = reader.point(); item.point2 = reader.point(); return item;
			}
			case GraphicsType.SubentColor:
			case GraphicsType.SubentLayer:
			case GraphicsType.SubentLineType:
			case GraphicsType.SubentMarker:
			case GraphicsType.SubentFillon:
			case GraphicsType.SubentLineWeight:
			case GraphicsType.SubEntityMaterial:
				return new ProxyScalarGeometry(type, reader.uint32(), reader.remaining >= 4 ? reader.uint32() : undefined);
			case GraphicsType.SubentLineTypeScale:
			case GraphicsType.SubentThickness:
				return new ProxyScalarGeometry(type, reader.double());
			case GraphicsType.SubentPlotStyleName:
				return new ProxyScalarGeometry(type, reader.int32(), reader.int32());
			case GraphicsType.PushModelTransform:
			case GraphicsType.PushModelTransform2:
				return new ProxyModelTransform(type, this.readMatrix(reader));
			default: return new ProxyRawGeometry(type, payload);
		}
	}

	private static readPolyline(reader: LittleEndianReader, item: ProxyPolyline): ProxyPolyline {
		const count = reader.int32();
		for (let index = 0; index < count; index++) item.points.push(reader.point());
		return item;
	}

	private static readMatrix(reader: LittleEndianReader): Matrix4 {
		const values = new Array<number>(16);
		for (let index = 0; index < 16; index++) values[index] = reader.double();
		return new Matrix4(values);
	}
}
