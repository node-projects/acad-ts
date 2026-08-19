import { Entity } from '../../Entities/Entity.js';
import { Viewport } from '../../Entities/Viewport.js';
import { Layer } from '../../Tables/Layer.js';
import { UCS } from '../../Tables/UCS.js';
import { VisualStyle } from '../../Objects/VisualStyle.js';
import { XYZ } from '../../Math/XYZ.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';

export class CadViewportTemplate extends CadEntityTemplateT<Viewport> {
	viewportHeaderHandle: number | null = null;

	boundaryHandle: number | null = null;

	namedUcsHandle: number | null = null;

	baseUcsHandle: number | null = null;

	visualStyleHandle: number | null = null;

	viewportId: number | null = null;

	blockHandle: number | null = null;

	frozenLayerHandles: Set<number> = new Set();

	constructor(entity?: Viewport) {
		super(entity ?? new Viewport());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		if (this.viewportId != null) {
			this.cadObject.id = this.viewportId;
		}

		const entity = builder.tryGetCadObject<Entity>(this.boundaryHandle);
		if (entity) {
			this.cadObject.boundary = entity;
		} else if (this.boundaryHandle != null && this.boundaryHandle > 0) {
			builder.notify(`Boundary ${this.boundaryHandle} not found for viewport ${this.cadObject.handle}`, NotificationType.Warning);
		}

		const applyUcs = (ucs: UCS): void => {
			this.cadObject.ucsPerViewport = true;
			this.cadObject.ucsOrigin = new XYZ(ucs.origin.x, ucs.origin.y, ucs.origin.z);
			this.cadObject.ucsXAxis = new XYZ(ucs.xAxis.x, ucs.xAxis.y, ucs.xAxis.z);
			this.cadObject.ucsYAxis = new XYZ(ucs.yAxis.x, ucs.yAxis.y, ucs.yAxis.z);
			this.cadObject.ucsOrthographicType = ucs.orthographicType;
			this.cadObject.elevation = ucs.elevation;
		};

		const baseUcs = builder.tryGetCadObject<UCS>(this.baseUcsHandle);
		if (baseUcs) {
			applyUcs(baseUcs);
		} else if (this.baseUcsHandle != null && this.baseUcsHandle > 0) {
			builder.notify(`Base ucs ${this.baseUcsHandle} not found for viewport ${this.cadObject.handle}`, NotificationType.Warning);
		}

		const namedUcs = builder.tryGetCadObject<UCS>(this.namedUcsHandle);
		if (namedUcs) {
			applyUcs(namedUcs);
		} else if (this.namedUcsHandle != null && this.namedUcsHandle > 0) {
			builder.notify(`Named ucs ${this.namedUcsHandle} not found for viewport ${this.cadObject.handle}`, NotificationType.Warning);
		}

		const visualStyle = builder.tryGetCadObject<VisualStyle>(this.visualStyleHandle);
		if (visualStyle) {
			this.cadObject.visualStyle = visualStyle;
		} else if (this.visualStyleHandle != null && this.visualStyleHandle > 0) {
			builder.notify(`Visual style ${this.visualStyleHandle} not found for viewport ${this.cadObject.handle}`, NotificationType.Warning);
		}

		for (const handle of this.frozenLayerHandles) {
			const layer = builder.tryGetCadObject<Layer>(handle);
			if (layer) {
				this.cadObject.frozenLayers.push(layer);
			} else {
				builder.notify(`Frozen layer ${handle} not found for viewport ${this.cadObject.handle}`, NotificationType.Warning);
			}
		}
	}
}
