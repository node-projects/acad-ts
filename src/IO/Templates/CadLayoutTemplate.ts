import { Viewport } from '../../Entities/Viewport.js';
import { Layout } from '../../Objects/Layout.js';
import { BlockRecord } from '../../Tables/BlockRecord.js';
import { UCS } from '../../Tables/UCS.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTemplateT } from './CadTemplate[T].js';

export class CadLayoutTemplate extends CadTemplateT<Layout> {
	PaperSpaceBlockHandle: number | null = null;

	ActiveViewportHandle: number | null = null;

	BaseUcsHandle: number | null = null;

	NamesUcsHandle: number | null = null;

	LasActiveViewportHandle: number | null = null;

	ViewportHandles: Set<number> = new Set();

	constructor(layout?: Layout) {
		super(layout ?? new Layout());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const record = builder.TryGetCadObject<BlockRecord>(this.PaperSpaceBlockHandle);
		if (record) {
			this.CadObject.associatedBlock = record;
		}

		const viewport = builder.TryGetCadObject<Viewport>(this.ActiveViewportHandle);
		if (viewport) {
			this.CadObject.lastActiveViewport = viewport;
		}

		const ucs = builder.TryGetCadObject<UCS>(this.BaseUcsHandle);
		if (ucs) {
			this.CadObject.baseUCS = ucs;
		}

		const nameducs = builder.TryGetCadObject<UCS>(this.NamesUcsHandle);
		if (nameducs) {
			this.CadObject.ucs = nameducs;
		}

		for (const handle of this.ViewportHandles) {
			const vp = builder.TryGetCadObject<Viewport>(handle);
		}
	}
}
