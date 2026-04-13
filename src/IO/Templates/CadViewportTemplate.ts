import { Entity } from '../../Entities/Entity.js';
import { Viewport } from '../../Entities/Viewport.js';
import { Layer } from '../../Tables/Layer.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadEntityTemplateT } from './CadEntityTemplate.js';

export class CadViewportTemplate extends CadEntityTemplateT<Viewport> {
	ViewportHeaderHandle: number | null = null;

	BoundaryHandle: number | null = null;

	NamedUcsHandle: number | null = null;

	BaseUcsHandle: number | null = null;

	VisualStyleHandle: number | null = null;

	ViewportId: number | null = null;

	BlockHandle: number | null = null;

	FrozenLayerHandles: Set<number> = new Set();

	constructor(entity?: Viewport) {
		super(entity ?? new Viewport());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const entity = builder.TryGetCadObject<Entity>(this.BoundaryHandle);
		if (entity) {
			this.CadObject.boundary = entity;
		} else if (this.BoundaryHandle != null && this.BoundaryHandle > 0) {
			builder.Notify(`Boundary ${this.BoundaryHandle} not found for viewport ${this.CadObject.handle}`, NotificationType.Warning);
		}

		if (this.NamedUcsHandle != null && this.NamedUcsHandle > 0) {
			builder.Notify(`Named ucs not implemented for Viewport, handle ${this.NamedUcsHandle}`);
		}

		if (this.BaseUcsHandle != null && this.BaseUcsHandle > 0) {
			builder.Notify(`Base ucs not implemented for Viewport, handle ${this.BaseUcsHandle}`);
		}

		for (const handle of this.FrozenLayerHandles) {
			const layer = builder.TryGetCadObject<Layer>(handle);
			if (layer) {
				this.CadObject.frozenLayers.push(layer);
			} else {
				builder.Notify(`Frozen layer ${handle} not found for viewport ${this.CadObject.handle}`, NotificationType.Warning);
			}
		}
	}
}
