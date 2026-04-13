import { Entity } from '../../Entities/Entity.js';
import { IPolyline } from '../../Entities/IPolyline.js';
import { Polyline2D } from '../../Entities/Polyline2D.js';
import { Polyline3D } from '../../Entities/Polyline3D.js';
import { PolyfaceMesh } from '../../Entities/PolyfaceMesh.js';
import { PolygonMesh } from '../../Entities/PolygonMesh.js';
import { PolygonMeshVertex } from '../../Entities/PolygonMeshVertex.js';
import { Seqend } from '../../Entities/Seqend.js';
import { Vertex } from '../../Entities/Vertex.js';
import { Vertex2D } from '../../Entities/Vertex2D.js';
import { Vertex3D } from '../../Entities/Vertex3D.js';
import { VertexFaceMesh } from '../../Entities/VertexFaceMesh.js';
import { VertexFaceRecord } from '../../Entities/VertexFaceRecord.js';
import { ObjectType } from '../../Types/ObjectType.js';
import { Polyline } from '../../Entities/Polyline.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';
import { ICadOwnerTemplate } from './ICadOwnerTemplate.js';

export class CadPolyLineTemplate extends CadEntityTemplate implements ICadOwnerTemplate {
	FirstVertexHandle: number | null = null;

	LastVertexHandle: number | null = null;

	SeqendHandle: number | null = null;

	OwnedObjectsHandlers: Set<number> = new Set();

	constructor(entity?: IPolyline) {
		super(entity ? (entity as unknown as Entity) : new PolyLinePlaceholder());
	}

	SetPolyLineObject(polyLine: Polyline): void {
		polyLine.handle = this.CadObject.handle;
		polyLine.color = this.CadObject.color;
		polyLine.lineWeight = this.CadObject.lineWeight;
		polyLine.lineTypeScale = this.CadObject.lineTypeScale;
		polyLine.isInvisible = this.CadObject.isInvisible;
		polyLine.transparency = this.CadObject.transparency;

		this.CadObject = polyLine;
	}

	protected addVertices(builder: CadDocumentBuilder, ...vertices: Entity[]): void {
		const obj = this.CadObject;
		if (obj instanceof Polyline2D) {
			for (const v of vertices) {
				(obj as Polyline2D).vertices.push(v as Vertex2D);
				v.owner = obj;
			}
		} else if (obj instanceof Polyline3D) {
			for (const v of vertices) {
				(obj as Polyline3D).vertices.push(v as Vertex3D);
				v.owner = obj;
			}
		} else if (obj instanceof PolyfaceMesh) {
			for (const item of vertices) {
				this.addPolyfaceMeshVertex(builder, obj as PolyfaceMesh, item);
			}
		} else if (obj instanceof PolygonMesh) {
			for (const v of vertices) {
				(obj as PolygonMesh).vertices.push(v as PolygonMeshVertex);
				v.owner = obj;
			}
		} else {
			builder.Notify(`Unknown polyline type ${this.CadObject.subclassMarker}`, NotificationType.Warning);
		}
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const seqend = builder.TryGetCadObject<Seqend>(this.SeqendHandle);
		if (seqend) {
			this.setSeqend(builder, seqend);
		}

		if (this.FirstVertexHandle != null) {
			const vertices = Array.from(this.getEntitiesCollection<Vertex>(builder, this.FirstVertexHandle, this.LastVertexHandle!));
			this.addVertices(builder, ...vertices);
		} else {
			if (this.CadObject instanceof PolyfaceMesh) {
				this.buildPolyfaceMesh(this.CadObject as PolyfaceMesh, builder);
			} else {
				for (const handle of this.OwnedObjectsHandlers) {
					const v = builder.TryGetCadObject<Vertex>(handle);
					if (v) {
						this.addVertices(builder, v);
					} else {
						const s = builder.TryGetCadObject<Seqend>(handle);
						if (s) {
							this.setSeqend(builder, s);
						} else {
							builder.Notify(`Vertex ${handle} not found for polyline ${this.CadObject.handle}`, NotificationType.Warning);
						}
					}
				}
			}
		}
	}

	protected setSeqend(builder: CadDocumentBuilder, seqend: Seqend): void {
		const obj = this.CadObject;
		seqend.owner = obj;
		if (obj instanceof Polyline2D) {
			(obj as Polyline2D).vertices.Seqend = seqend;
		} else if (obj instanceof Polyline3D) {
			(obj as Polyline3D).vertices.Seqend = seqend;
		} else if (obj instanceof PolyfaceMesh) {
			(obj as PolyfaceMesh).vertices.Seqend = seqend;
		} else if (obj instanceof PolygonMesh) {
			(obj as PolygonMesh).vertices.Seqend = seqend;
		} else {
			builder.Notify(`Unknown polyline type ${this.CadObject.subclassMarker}`, NotificationType.Warning);
		}
	}

	private buildPolyfaceMesh(polyfaceMesh: PolyfaceMesh, builder: CadDocumentBuilder): void {
		for (const handle of this.OwnedObjectsHandlers) {
			const e = builder.TryGetCadObject<Entity>(handle);
			if (e) {
				this.addPolyfaceMeshVertex(builder, polyfaceMesh, e);
			}
		}
	}

	private addPolyfaceMeshVertex(builder: CadDocumentBuilder, polyfaceMesh: PolyfaceMesh, e: Entity): void {
		if (e instanceof VertexFaceMesh) {
			polyfaceMesh.vertices.push(e as VertexFaceMesh);
			e.owner = polyfaceMesh;
		} else if (e instanceof VertexFaceRecord) {
			polyfaceMesh.faces.push(e as VertexFaceRecord);
			e.owner = polyfaceMesh;
		} else if (e instanceof Seqend) {
			polyfaceMesh.vertices.Seqend = e as Seqend;
			e.owner = polyfaceMesh;
		} else {
			builder.Notify(`Unidentified type for PolyfaceMesh ${e.constructor.name}`);
		}
	}
}

class PolyLinePlaceholder extends Polyline {
	override get objectType(): ObjectType { return ObjectType.INVALID; }
	override get subclassMarker(): string { return 'PolyLinePlaceholder'; }
	getBoundingBox(): any { return null; }
}
