import { LineType , LineTypeSegment} from '../../Tables/LineType.js';
import { TextStyle } from '../../Tables/TextStyle.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';

export class CadLineTypeTemplate extends CadTableEntryTemplate<LineType> {
	ltypeControlHandle: number | null = null;

	totalLen: number | null = null;

	segmentTemplates: CadLineTypeTemplate.SegmentTemplate[] = [];

	constructor(entry?: LineType) {
		super(entry ?? new LineType());
	}

	protected override _build(builder: CadDocumentBuilder): void {
		super._build(builder);

		for (const item of this.segmentTemplates) {
			item.build(builder);
			this.cadObject.addSegment(item.segment);
		}
	}
}

export namespace CadLineTypeTemplate {
	export class SegmentTemplate {
		styleHandle: number | null = null;

		segment: LineTypeSegment = new LineTypeSegment();

		build(builder: CadDocumentBuilder): void {
			const style = builder.tryGetCadObject<TextStyle>(this.styleHandle);
			if (style) {
				this.segment.style = style;
			}
		}
	}
}
