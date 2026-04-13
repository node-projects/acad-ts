import { LineType , LineTypeSegment} from '../../Tables/LineType.js';
import { TextStyle } from '../../Tables/TextStyle.js';
import { CadDocumentBuilder } from '../CadDocumentBuilder.js';
import { CadTableEntryTemplate } from './CadTableEntryTemplate.js';

export class CadLineTypeTemplate extends CadTableEntryTemplate<LineType> {
	LtypeControlHandle: number | null = null;

	TotalLen: number | null = null;

	SegmentTemplates: CadLineTypeTemplate.SegmentTemplate[] = [];

	constructor(entry?: LineType) {
		super(entry ?? new LineType());
	}

	protected override build(builder: CadDocumentBuilder): void {
		super.build(builder);

		for (const item of this.SegmentTemplates) {
			item.Build(builder);
			this.CadObject.addSegment(item.Segment);
		}
	}
}

export namespace CadLineTypeTemplate {
	export class SegmentTemplate {
		StyleHandle: number | null = null;

		Segment: LineTypeSegment = new LineTypeSegment();

		Build(builder: CadDocumentBuilder): void {
			const style = builder.TryGetCadObject<TextStyle>(this.StyleHandle);
			if (style) {
				this.Segment.style = style;
			}
		}
	}
}
