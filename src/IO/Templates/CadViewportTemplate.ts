import { Entity } from '../../Entities/Entity.js';
import { Viewport } from '../../Entities/Viewport.js';
import { Layer } from '../../Tables/Layer.js';
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

		if (this.namedUcsHandle != null && this.namedUcsHandle > 0) {
			builder.notify(`Named ucs not implemented for Viewport, handle ${this.namedUcsHandle}`);
		}

		if (this.baseUcsHandle != null && this.baseUcsHandle > 0) {
			builder.notify(`Base ucs not implemented for Viewport, handle ${this.baseUcsHandle}`);
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
