import { CadObject } from '../../CadObject.js';
import { UCS } from '../../Tables/UCS.js';
import { VPort } from '../../Tables/VPort.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';

export class CadVPortTemplate extends CadTableEntryTemplate<VPort> {
	VportControlHandle: number = 0;

	BackgroundHandle: number | null = null;

	StyleHandle: number | null = null;

	SunHandle: number | null = null;

	NamedUcsHandle: number | null = null;

	BaseUcsHandle: number | null = null;

	constructor(cadObject?: VPort) {
		super(cadObject ?? new VPort());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		const baseUcs = builder.TryGetCadObject<UCS>(this.BaseUcsHandle);
		if (baseUcs) {
			this.CadObject.baseUcs = baseUcs;
		} else if (this.BaseUcsHandle != null && this.BaseUcsHandle > 0) {
			builder.Notify(`Boundary ${this.BaseUcsHandle} not found for viewport ${this.CadObject.handle}`, NotificationType.Warning);
		}

		const namedUcs = builder.TryGetCadObject<UCS>(this.NamedUcsHandle);
		if (namedUcs) {
			this.CadObject.baseUcs = namedUcs;
		} else if (this.NamedUcsHandle != null && this.NamedUcsHandle > 0) {
			builder.Notify(`Boundary ${this.BaseUcsHandle} not found for viewport ${this.CadObject.handle}`, NotificationType.Warning);
		}

		const style = builder.TryGetCadObject<CadObject>(this.StyleHandle);
	}
}
