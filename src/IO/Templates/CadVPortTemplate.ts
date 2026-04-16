import { CadObject } from '../../CadObject.js';
import { UCS } from '../../Tables/UCS.js';
import { VPort } from '../../Tables/VPort.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';

export class CadVPortTemplate extends CadTableEntryTemplate<VPort> {
	vportControlHandle: number = 0;

	backgroundHandle: number | null = null;

	styleHandle: number | null = null;

	sunHandle: number | null = null;

	namedUcsHandle: number | null = null;

	baseUcsHandle: number | null = null;

	constructor(cadObject?: VPort) {
		super(cadObject ?? new VPort());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const baseUcs = builder.tryGetCadObject<UCS>(this.baseUcsHandle);
		if (baseUcs) {
			this.cadObject.baseUcs = baseUcs;
		} else if (this.baseUcsHandle != null && this.baseUcsHandle > 0) {
			builder.notify(`Boundary ${this.baseUcsHandle} not found for viewport ${this.cadObject.handle}`, NotificationType.Warning);
		}

		const namedUcs = builder.tryGetCadObject<UCS>(this.namedUcsHandle);
		if (namedUcs) {
			this.cadObject.baseUcs = namedUcs;
		} else if (this.namedUcsHandle != null && this.namedUcsHandle > 0) {
			builder.notify(`Boundary ${this.baseUcsHandle} not found for viewport ${this.cadObject.handle}`, NotificationType.Warning);
		}

		const style = builder.tryGetCadObject<CadObject>(this.styleHandle);
	}
}
