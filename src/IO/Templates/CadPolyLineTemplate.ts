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
import { BoundingBox } from '../../Math/BoundingBox.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadEntityTemplate } from './CadEntityTemplate.js';
import { ICadOwnerTemplate } from './ICadOwnerTemplate.js';

export class CadPolyLineTemplate extends CadEntityTemplate implements ICadOwnerTemplate {
	firstVertexHandle: number | null = null;

	lastVertexHandle: number | null = null;

	seqendHandle: number | null = null;

	ownedObjectsHandlers: Set<number> = new Set();

	constructor(entity?: IPolyline) {
		super(entity ? (entity as unknown as Entity) : new PolyLinePlaceholder());
	}

	setPolyLineObject(polyLine: Polyline): void {
		polyLine.handle = this.cadObject.handle;
		polyLine.color = this.cadObject.color;
		polyLine.lineWeight = this.cadObject.lineWeight;
		polyLine.lineTypeScale = this.cadObject.lineTypeScale;
		polyLine.isInvisible = this.cadObject.isInvisible;
		polyLine.transparency = this.cadObject.transparency;

		this.cadObject = polyLine;
	}

	protected addVertices(builder: CadDocumentBuilder, ...vertices: Entity[]): void {
		const obj = this.cadObject;
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
				this._addPolyfaceMeshVertex(builder, obj as PolyfaceMesh, item);
			}
		} else if (obj instanceof PolygonMesh) {
			for (const v of vertices) {
				(obj as PolygonMesh).vertices.push(v as PolygonMeshVertex);
				v.owner = obj;
			}
		} else {
			builder.notify(`Unknown polyline type ${this.cadObject.subclassMarker}`, NotificationType.Warning);
		}
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const seqend = builder.tryGetCadObject<Seqend>(this.seqendHandle);
		if (seqend) {
			this.setSeqend(builder, seqend);
		}

		if (this.firstVertexHandle != null) {
			const vertices = Array.from(this.getEntitiesCollection<Vertex>(builder, this.firstVertexHandle, this.lastVertexHandle!));
			this.addVertices(builder, ...vertices);
		} else {
			if (this.cadObject instanceof PolyfaceMesh) {
				this._buildPolyfaceMesh(this.cadObject as PolyfaceMesh, builder);
			} else {
				for (const handle of this.ownedObjectsHandlers) {
					const v = builder.tryGetCadObject<Vertex>(handle);
					if (v) {
						this.addVertices(builder, v);
					} else {
						const s = builder.tryGetCadObject<Seqend>(handle);
						if (s) {
							this.setSeqend(builder, s);
						} else {
							builder.notify(`Vertex ${handle} not found for polyline ${this.cadObject.handle}`, NotificationType.Warning);
						}
					}
				}
			}
		}
	}

	protected setSeqend(builder: CadDocumentBuilder, seqend: Seqend): void {
		const obj = this.cadObject;
		seqend.owner = obj;
		if (obj instanceof Polyline2D) {
			(obj as Polyline2D).vertices.seqend = seqend;
		} else if (obj instanceof Polyline3D) {
			(obj as Polyline3D).vertices.seqend = seqend;
		} else if (obj instanceof PolyfaceMesh) {
			(obj as PolyfaceMesh).vertices.seqend = seqend;
		} else if (obj instanceof PolygonMesh) {
			(obj as PolygonMesh).vertices.seqend = seqend;
		} else {
			builder.notify(`Unknown polyline type ${this.cadObject.subclassMarker}`, NotificationType.Warning);
		}
	}

	private _buildPolyfaceMesh(polyfaceMesh: PolyfaceMesh, builder: CadDocumentBuilder): void {
		for (const handle of this.ownedObjectsHandlers) {
			const e = builder.tryGetCadObject<Entity>(handle);
			if (e) {
				this._addPolyfaceMeshVertex(builder, polyfaceMesh, e);
			}
		}
	}

	private _addPolyfaceMeshVertex(builder: CadDocumentBuilder, polyfaceMesh: PolyfaceMesh, e: Entity): void {
		if (e instanceof VertexFaceMesh) {
			polyfaceMesh.vertices.push(e as VertexFaceMesh);
			e.owner = polyfaceMesh;
		} else if (e instanceof VertexFaceRecord) {
			polyfaceMesh.faces.push(e as VertexFaceRecord);
			e.owner = polyfaceMesh;
		} else if (e instanceof Seqend) {
			polyfaceMesh.vertices.seqend = e as Seqend;
			e.owner = polyfaceMesh;
		} else {
			builder.notify(`Unidentified type for PolyfaceMesh ${e.constructor.name}`);
		}
	}
}

class PolyLinePlaceholder extends Polyline {
	override get objectType(): ObjectType { return ObjectType.INVALID; }
	override get subclassMarker(): string { return 'PolyLinePlaceholder'; }
	override getBoundingBox(): BoundingBox | null { return null; }
}
