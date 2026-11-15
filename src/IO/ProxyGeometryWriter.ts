import * as G from '../Entities/ProxyGraphics.js';
import { XYZ } from '../Math/XYZ.js';

class BinaryWriter {
	private chunks: Uint8Array[] = [];
	int(value: number): void { const bytes = new Uint8Array(4); new DataView(bytes.buffer).setUint32(0, value >>> 0, true); this.bytes(bytes); }
	double(value: number): void { const bytes = new Uint8Array(8); new DataView(bytes.buffer).setFloat64(0, value, true); this.bytes(bytes); }
	point(point: XYZ): void { this.double(point.x); this.double(point.y); this.double(point.z); }
	points(points: XYZ[]): void { this.int(points.length); for (const point of points) this.point(point); }
	bytes(bytes: Uint8Array): void { this.chunks.push(bytes); }
	result(): Uint8Array { const data = new Uint8Array(this.chunks.reduce((sum, chunk) => sum + chunk.length, 0)); let offset = 0; for (const chunk of this.chunks) { data.set(chunk, offset); offset += chunk.length; } return data; }
}

export class ProxyGeometryWriter {
	static writeGeometries(geometries: Iterable<G.IProxyGeometry>): Uint8Array {
		const entries = [...geometries];
		const chunks = entries.map(geometry => this.writeGeometry(geometry));
		const result = new BinaryWriter();
		result.int(8 + chunks.reduce((sum, data) => sum + data.length + 8, 0));
		result.int(chunks.length);
		for (let i = 0; i < chunks.length; i++) {
			result.int(chunks[i].length + 8);
			result.int(entries[i].graphicsType);
			result.bytes(chunks[i]);
		}
		return result.result();
	}

	private static writeGeometry(geometry: G.IProxyGeometry): Uint8Array {
		const writer = new BinaryWriter();
		if (geometry instanceof G.ProxyRawGeometry) return geometry.data;
		if (geometry instanceof G.ProxyExtents) { writer.point(geometry.min); writer.point(geometry.max); }
		else if (geometry instanceof G.ProxyCircle) { writer.point(geometry.center); writer.double(geometry.radius); writer.point(geometry.normal); }
		else if (geometry instanceof G.ProxyCirclePt3 || geometry instanceof G.ProxyCircularArc3Pt) {
			writer.point(geometry.point1); writer.point(geometry.point2); writer.point(geometry.point3);
			if (geometry instanceof G.ProxyCircularArc3Pt) writer.int(geometry.arcType);
		} else if (geometry instanceof G.ProxyCircularArc) {
			writer.point(geometry.center); writer.double(geometry.radius); writer.point(geometry.normal);
			writer.point(geometry.startVectorDirection); writer.double(geometry.sweepAngle); writer.int(geometry.arcType);
		} else if (geometry instanceof G.ProxyPolyline) {
			writer.points(geometry.points);
			if (geometry instanceof G.ProxyPolylineWithNormal) writer.point(geometry.normal);
		} else if (geometry instanceof G.ProxyXLine) { writer.point(geometry.point1); writer.point(geometry.point2); }
		else if (geometry instanceof G.ProxyRay) { writer.point(geometry.constructionLinePoint); writer.point(geometry.point2); }
		else if (geometry instanceof G.ProxyMesh) {
			writer.int(geometry.rowCount); writer.int(geometry.columnCount);
			for (const vertex of geometry.vertices) writer.point(vertex);
			writer.bytes(geometry.traitsData.length ? geometry.traitsData : new Uint8Array(12));
		} else if (geometry instanceof G.ProxyShell) {
			writer.points(geometry.vertices);
			writer.int(geometry.faces.reduce((sum, face) => sum + face.length + 1, 0));
			for (const [faceIndex, face] of geometry.faces.entries()) { writer.int(geometry.holes.includes(faceIndex) ? -face.length : face.length); for (const index of face) writer.int(index); }
			writer.bytes(geometry.traitsData.length ? geometry.traitsData : new Uint8Array(12));
		} else if (geometry instanceof G.ProxyScalarGeometry) {
			if (geometry.graphicsType === G.GraphicsType.SubentLineTypeScale || geometry.graphicsType === G.GraphicsType.SubentThickness) writer.double(geometry.value);
			else { writer.int(geometry.value); if (geometry.secondaryValue !== undefined) writer.int(geometry.secondaryValue); }
		} else if (geometry instanceof G.ProxyModelTransform) {
			for (let row = 0; row < 4; row++) for (let column = 0; column < 4; column++) writer.double(geometry.matrix.get(row, column));
		} else if (![G.GraphicsType.PopClip, G.GraphicsType.PopModelTransform, G.GraphicsType.Unknown37].includes(geometry.graphicsType)) {
			throw new Error(`Unsupported proxy geometry ${geometry.graphicsType}`);
		}
		return writer.result();
	}
}
