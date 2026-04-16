import { XYZ } from '../../Math/XYZ.js';
import { VisualStyle } from '../../Objects/VisualStyle.js';
import { UCS } from '../../Tables/UCS.js';
import { View } from '../../Tables/View.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { NotificationType } from '../NotificationEventHandler.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';

export class CadViewTemplate extends CadTableEntryTemplate<View> {
	visualStyleHandle: number | null = null;

	namedUcsHandle: number | null = null;

	ucsHandle: number | null = null;

	constructor(entry?: View) {
		super(entry ?? new View());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		const visualStyle = builder.tryGetCadObject<VisualStyle>(this.visualStyleHandle);
		if (visualStyle) {
			this.cadObject.visualStyle = visualStyle;
		} else if (this.visualStyleHandle != null && this.visualStyleHandle > 0) {
			builder.notify(`Visual style ${this.visualStyleHandle} not found for view ${this.cadObject.handle}`, NotificationType.Warning);
		}

		const applyUcs = (ucs: UCS): void => {
			this.cadObject.isUcsAssociated = true;
			this.cadObject.ucsOrigin = new XYZ(ucs.origin.x, ucs.origin.y, ucs.origin.z);
			this.cadObject.ucsXAxis = new XYZ(ucs.xAxis.x, ucs.xAxis.y, ucs.xAxis.z);
			this.cadObject.ucsYAxis = new XYZ(ucs.yAxis.x, ucs.yAxis.y, ucs.yAxis.z);
			this.cadObject.ucsElevation = ucs.elevation;
			this.cadObject.ucsOrthographicType = ucs.orthographicType;
		};

		const ucs = builder.tryGetCadObject<UCS>(this.ucsHandle);
		if (ucs) {
			applyUcs(ucs);
		} else if (this.ucsHandle != null && this.ucsHandle > 0) {
			builder.notify(`Base ucs ${this.ucsHandle} not found for view ${this.cadObject.handle}`, NotificationType.Warning);
		}

		const namedUcs = builder.tryGetCadObject<UCS>(this.namedUcsHandle);
		if (namedUcs) {
			applyUcs(namedUcs);
		} else if (this.namedUcsHandle != null && this.namedUcsHandle > 0) {
			builder.notify(`Named ucs ${this.namedUcsHandle} not found for view ${this.cadObject.handle}`, NotificationType.Warning);
		}
	}
}
