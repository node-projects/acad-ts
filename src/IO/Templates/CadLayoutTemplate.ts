import { Viewport } from '../../Entities/Viewport.js';
import { Layout } from '../../Objects/Layout.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { UCS } from '../../Tables/UCS.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadLayoutTemplate extends CadTemplateT<Layout> {
	paperSpaceBlockHandle: number | null = null;

	activeViewportHandle: number | null = null;

	baseUcsHandle: number | null = null;

	namesUcsHandle: number | null = null;

	lasActiveViewportHandle: number | null = null;

	viewportHandles: Set<number> = new Set();

	constructor(layout?: Layout) {
		super(layout ?? new Layout());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const record = builder.tryGetCadObject<BlockRecord>(this.paperSpaceBlockHandle);
		if (record) {
			this.cadObject.associatedBlock = record;
		}

		const viewportHandle = this.activeViewportHandle ?? this.lasActiveViewportHandle;
		const viewport = builder.tryGetCadObject<Viewport>(viewportHandle);
		if (viewport instanceof Viewport) {
			this.cadObject.lastActiveViewport = viewport;
		}

		const ucs = builder.tryGetCadObject<UCS>(this.baseUcsHandle);
		if (ucs) {
			this.cadObject.baseUCS = ucs;
		}

		const nameducs = builder.tryGetCadObject<UCS>(this.namesUcsHandle);
		if (nameducs) {
			this.cadObject.ucs = nameducs;
		}

		for (const handle of this.viewportHandles) {
			const vp = builder.tryGetCadObject<Viewport>(handle);
		}
	}
}
